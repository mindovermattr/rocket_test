import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('api/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.leadsService.findAll(page, limit);
  }

  @Get('pipelines')
  findAllPipelines() {
    return this.leadsService.findAllPipelines();
  }

  @Get('pipeline/:pipelineId')
  findPipeline(@Param('pipelineId', ParseIntPipe) pipelineId: number) {
    return this.leadsService.findPipeline(pipelineId);
  }
}
