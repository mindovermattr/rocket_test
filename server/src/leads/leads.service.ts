import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OauthService } from 'src/oauth/oauth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
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
}
