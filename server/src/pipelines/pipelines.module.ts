import { Module } from '@nestjs/common';
import { OauthModule } from 'src/oauth/oauth.module';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';

@Module({
  imports: [OauthModule],
  controllers: [PipelinesController],
  providers: [PipelinesService],
})
export class PipelinesModule {}
