// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service';
import { OauthProvider } from '../user/model/oauth-provider';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async handleOAuthLogin(oauthProfile: {
    oauthId: string;
    provider: OauthProvider;
  }) {
    const user = await this.userService.findOrCreateByOAuthId(
      oauthProfile.oauthId,
      oauthProfile.provider,
    );
    const payload = {
      userId: user._id.toString(),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      userId: user._id.toString(),
      accessToken,
    };
  }

  async validateToken(token: string): Promise<string | null> {
    try {
      const payload: { userId: string } = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.userId);

      if (!user) {
        return null;
      }

      return payload.userId;
    } catch {
      return null;
    }
  }
}
