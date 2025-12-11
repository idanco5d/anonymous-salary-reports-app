import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  @Get('/login')
  @UseGuards(GoogleOAuthGuard)
  async login() {}

  @Get('/google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async redirect(@Req() req) {
    return { userId: req.user.sub };
  }
}
