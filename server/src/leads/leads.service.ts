import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(page = 1, limit = 50) {
    const token = await this.prisma.amoToken.findFirstOrThrow({ orderBy: { updatedAt: 'desc' } });
    if (!token) throw new NotFoundException('amoCRM account is not connected');

    const { data } = await firstValueFrom(
      this.httpService.get<LeadDto>(`https://${token.referer}/api/v4/leads`, {
        params: { page: Math.max(page, 1), limit: Math.min(Math.max(limit, 1), 250) },
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
    );

    return data;
  }
}
