import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

export interface AmoTokenResponse {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class OauthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async exchangeCode(code: string, referer: string) {
    const body = {
      client_id: this.config.get('AMO_CLIENT_ID') as string,
      client_secret: this.config.get('AMO_CLIENT_SECRET') as string,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.get('AMO_REDIRECT_URI') as string,
    };

    const { data } = await firstValueFrom(
      this.httpService.post<AmoTokenResponse>(`https://${referer}/oauth2/access_token`, body, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const mappedValues = {
      tokenType: data.token_type,
      accessToken: data.access_token,
      expiresAt: new Date(data.expires_in),
      refreshToken: data.refresh_token,
      referer: referer,
    };

    await this.prisma.amoToken.upsert({
      create: mappedValues,
      update: mappedValues,
      where: {
        referer: referer,
      },
    });

    return data;
  }

  authorize() {
    const state = randomBytes(32).toString('base64url');
    const clientId = this.config.get('AMO_CLIENT_ID') as string;

    return { state, clientId };
  }

  verifyState(expected: string | undefined, actual: string | undefined) {
    if (!expected || !actual || expected !== actual) {
      throw new UnauthorizedException('Invalid OAuth state');
    }
  }
}
