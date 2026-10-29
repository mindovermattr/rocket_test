import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
