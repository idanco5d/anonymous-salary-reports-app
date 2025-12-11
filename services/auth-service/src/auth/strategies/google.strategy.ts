import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OauthProvider } from '../../user/model/oauth-provider';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/callback',
      scope: ['openid'], // 'openid' gets you the ID token with 'sub'
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { id: string },
    done: VerifyCallback,
  ) {
    const user = {
      googleId: profile.id,
      provider: OauthProvider.GOOGLE,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
