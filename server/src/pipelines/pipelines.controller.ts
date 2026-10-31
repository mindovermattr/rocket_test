import { Controller, Get } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';

@Controller('api/pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  findAll() {
    return this.pipelinesService.findAll();
  }
}
