import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { AmoToken } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import type { AmoTokenResponse } from './oauth.service';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

@Injectable()
export class AmoRefreshInterceptor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AmoRefreshInterceptor.name);
  private interceptorId?: number;
  private refreshing?: Promise<AmoToken>;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.interceptorId = this.httpService.axiosRef.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.onError(error),
    );
  }

  onModuleDestroy() {
    if (this.interceptorId !== undefined) {
      this.httpService.axiosRef.interceptors.response.eject(this.interceptorId);
    }
  }

  private async onError(error: AxiosError) {
    const config = error.config as RetryConfig | undefined;
    const url = config?.url ?? '';

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retry ||
      !url.includes('amocrm.') ||
      url.includes('/oauth2/')
    ) {
      throw error;
    }

    config._retry = true;

    let token: AmoToken;
    try {
      token = await this.refresh();
    } catch (refreshError) {
      this.logger.error('amoCRM token refresh failed', refreshError);
      throw error;
    }

    config.headers.set('Authorization', `Bearer ${token.accessToken}`);
    return this.httpService.axiosRef.request(config);
  }

  private refresh() {
    this.refreshing ??= this.refreshToken().finally(() => {
      this.refreshing = undefined;
    });
    return this.refreshing;
  }

  private async refreshToken() {
    const token = await this.prisma.amoToken.findFirstOrThrow({
      orderBy: { updatedAt: 'desc' },
    });

    const response = await fetch(`https://${token.referer}/oauth2/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.config.getOrThrow<string>('AMO_CLIENT_ID'),
        client_secret: this.config.getOrThrow<string>('AMO_CLIENT_SECRET'),
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        redirect_uri: this.config.getOrThrow<string>('AMO_REDIRECT_URI'),
      }),
    });

    if (!response.ok) {
      throw new Error(`amoCRM refresh failed with status ${response.status}`);
    }

    const data = (await response.json()) as AmoTokenResponse;

    return this.prisma.amoToken.update({
      where: { id: token.id },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });
  }
}
