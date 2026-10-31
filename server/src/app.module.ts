import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { OauthModule } from './oauth/oauth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PipelinesModule } from './pipelines/pipelines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      global: true,
      timeout: 5000,
      maxRedirects: 5,
    }),
    OauthModule,
    LeadsModule,
    PrismaModule,
    UsersModule,
    PipelinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
