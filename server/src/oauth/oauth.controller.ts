import { Controller, Get, Post } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { All, Body, Logger, Query } from '@nestjs/common';
import type { Request } from 'express';

interface AmoQuery {
  code: string;
  state: string;
  referer: string;
  platform: string;
  client_id: string;
}

interface TokenRequest {
  code: string;
  referer: string;
}

@Controller('oauth')
export class OauthController {
  private readonly logger = new Logger(OauthController.name);

  constructor(private readonly oauthService: OauthService) {}

  @Post('access_token')
  async getAccessToken(@Body() body: TokenRequest) {
    const { code, referer } = body;
    const data = await this.oauthService.exchangeCode(code, referer);
    // this.logger.log(data);
    return '';
  }

  @All('callback')
  callback(@Query() query: AmoQuery) {
    // this.logger.log(`Query: ${JSON.stringify(query, null, 2)}`);
    const { code, referer } = query;
    // this.logger.log(code, referer);
    return this.getAccessToken({ code, referer });
  }
}
