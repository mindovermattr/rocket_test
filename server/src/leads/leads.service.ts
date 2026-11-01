import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OauthService } from '../oauth/oauth.service';
import { LeadDto } from './dto/lead.dto';

export interface CreateLeadPayload {
  name: string;
  price?: number;
  pipeline_id?: number;
  status_id?: number;
  [key: string]: any;
}

export interface CreatedLeadResponse {
  _embedded?: {
    leads?: Array<LeadDto & { id: number }>;
  };
}

@Injectable()
export class LeadsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly oauthService: OauthService,
  ) {}

  async findAll(page = 1, limit = 50) {
    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.get<LeadDto>(`https://${token.referer}/api/v4/leads`, {
        params: { page: Math.max(page, 1), limit: Math.min(Math.max(limit, 1), 250) },
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
    );

    return data;
  }

  async createMany(leads: CreateLeadPayload[]) {
    if (!leads || leads.length === 0) {
      return { _embedded: { leads: [] } };
    }

    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.post<CreatedLeadResponse>(`https://${token.referer}/api/v4/leads`, leads, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    return data;
  }

  async updateMany(leads: Array<Record<string, any>>) {
    if (!leads || leads.length === 0) {
      return { _embedded: { leads: [] } };
    }

    const token = await this.oauthService.getFirstToken();

    const { data } = await firstValueFrom(
      this.httpService.patch<CreatedLeadResponse>(`https://${token.referer}/api/v4/leads`, leads, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    return data;
  }
}
