import { Controller, Get, NotFoundException, Query, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OAuthQueryDto } from './dto/oauth-query.dto';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('authorize')
  authorize(@Res() res: Response) {
    const data = this.oauthService.authorize();

    res.cookie('amo_oauth_state', data.state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
      path: '/oauth',
    });

    return res.redirect(
      `https://www.amocrm.ru/oauth?client_id=${data.clientId}&state=${data.state}&mode=popup`,
    );
  }

  @Get('callback')
  callback(
    @Query() query: OAuthQueryDto,
    @Req() req: Request & { cookies: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code, referer } = query;

    if (!code || !referer) throw new NotFoundException();

    try {
      this.oauthService.verifyState(req.cookies['amo_oauth_state'], query.state);
    } finally {
      res.clearCookie('amo_oauth_state', { path: '/oauth' });
    }

    return this.oauthService.exchangeCode(code, referer);
  }
}
