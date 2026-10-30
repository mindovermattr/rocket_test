import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('api/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Get('pipeline/:pipelineId')
  findPipeline(@Param('pipelineId', ParseIntPipe) pipelineId: number) {
    return this.leadsService.findPipeline(pipelineId);
  }
}
