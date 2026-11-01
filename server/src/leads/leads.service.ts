import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OauthService } from '../oauth/oauth.service';
import { CreateLeadDto, LeadResponseDto } from './dto/create-lead.dto';
import { Lead } from './entity/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly oauthService: OauthService,
  ) {}

  async findAll(page = 1, limit = 50) {
    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.get<Lead>(`https://${token.referer}/api/v4/leads`, {
        params: { page: Math.max(page, 1), limit: Math.min(Math.max(limit, 1), 250) },
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
    );

    return data;
  }

  async createMany(leads: CreateLeadDto[]) {
    if (!leads || leads.length === 0) {
      return { _embedded: { leads: [] } };
    }

    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.post<LeadResponseDto>(`https://${token.referer}/api/v4/leads`, leads, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    return data;
  }

  async updateMany(leads: CreateLeadDto[]) {
    if (!leads || leads.length === 0) {
      return { _embedded: { leads: [] } };
    }

    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.patch<LeadResponseDto>(`https://${token.referer}/api/v4/leads`, leads, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    return data;
  }
}
