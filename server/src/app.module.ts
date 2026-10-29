import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmoModule } from './amo/amo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    AmoModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
