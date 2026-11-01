import { Module } from '@nestjs/common';
import { OauthModule } from '../oauth/oauth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [OauthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
