import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface AmoTokenResponse {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
  referer?: string;
}

@Injectable()
export class OauthService {
  private readonly logger = new Logger(OauthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async exchangeCode(code: string, referer?: string) {
    const body = {
      client_id: this.config.get('AMO_CLIENT_ID') as string,
      client_secret: this.config.get('AMO_CLIENT_SECRET') as string,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.get('AMO_REDIRECT_URI') as string,
    };

    this.logger.log(JSON.stringify(body));

    const { data } = await firstValueFrom(
      this.httpService.post<AmoTokenResponse>(
        `https://${referer}/oauth2/access_token`,
        body,
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );

    this.logger.log(JSON.stringify(data));

    return data;
  }

  async getAccessToken(body: any) {
    const data = await firstValueFrom(
      this.httpService.get('https://api.example.com/users'),
    );
    return data;
  }
}
