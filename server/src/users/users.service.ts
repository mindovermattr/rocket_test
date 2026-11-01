import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OauthService } from '../oauth/oauth.service';
import { AmoUserResponse } from './types/amo-users.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly oauthService: OauthService,
    private readonly httpService: HttpService,
  ) {}

  async findAll() {
    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.get<AmoUserResponse>(`https://${token.referer}/api/v4/users`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
    );

    const users = data?._embedded?.users ?? [];

    return users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }
}
