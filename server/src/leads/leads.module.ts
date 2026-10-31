import { Module } from '@nestjs/common';
import { OauthModule } from 'src/oauth/oauth.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [OauthModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
