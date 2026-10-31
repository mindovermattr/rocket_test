import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeadDto } from './dto/lead.dto';
import { AmoCrmPipelinesResponse } from './types/amo-pipelines.types';
import { AmoUserResponse } from './types/amo-users.types';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(page = 1, limit = 50) {
    const token = await this.prisma.amoToken.findFirstOrThrow({ orderBy: { updatedAt: 'desc' } });

    const { data } = await firstValueFrom(
      this.httpService.get<LeadDto>(`https://${token.referer}/api/v4/leads`, {
        params: { page: Math.max(page, 1), limit: Math.min(Math.max(limit, 1), 250) },
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
    );

    return data;
  }

  async findPipeline(pipelineId: number) {
    const token = await this.prisma.amoToken.findFirstOrThrow({ orderBy: { updatedAt: 'desc' } });

    const { data } = await firstValueFrom(
      this.httpService.get<LeadDto>(
        `https://${token.referer}/api/v4/leads/pipelines/${pipelineId}`,
        {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        },
      ),
    );

    return data;
  }

  async findAllPipelines() {
    const token = await this.prisma.amoToken.findFirstOrThrow({ orderBy: { updatedAt: 'desc' } });

    const { data } = await firstValueFrom(
      this.httpService.get<AmoCrmPipelinesResponse>(
        `https://${token.referer}/api/v4/leads/pipelines`,
        {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        },
      ),
    );

    const pipelines = data?._embedded?.pipelines ?? [];

    return pipelines.map((pipeline) => ({
      id: pipeline.id,
      pipelineName: pipeline.name,
      statuses: (pipeline._embedded?.statuses ?? [])
        .sort((a, b) => a.sort - b.sort)
        .map((status) => ({
          id: status.id,
          name: status.name,
        })),
    }));
  }

  async findAllUsers() {
    const token = await this.prisma.amoToken.findFirstOrThrow({ orderBy: { updatedAt: 'desc' } });

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
