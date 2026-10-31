import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OauthService } from 'src/oauth/oauth.service';
import { AmoCrmPipelinesResponse } from './types/amo-pipelines.types';

@Injectable()
export class PipelinesService {
  constructor(
    private readonly oauthService: OauthService,
    private readonly httpService: HttpService,
  ) {}

  async findAll() {
    const token = await this.oauthService.getFirstToken();

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
}
