import { Module } from '@nestjs/common';
import { AmoRefreshInterceptor } from './amo-refresh.interceptor';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  controllers: [OauthController],
  providers: [OauthService, AmoRefreshInterceptor],
})
export class OauthModule {}
