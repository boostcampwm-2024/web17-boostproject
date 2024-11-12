import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleAuthService } from '@/auth/googleAuth.service';
import { OauthType } from '@/user/domain/ouathType';

export interface OauthUserInfo {
  type: OauthType;
  oauthId: string;
  email?: string;
  givenName?: string;
  familyName?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly googleAuthService: GoogleAuthService@Inject('winston') private readonly logger: Logger) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, emails, name, provider } = profile;

    const userInfo = {
      type: provider.toUpperCase() as OauthType,
      oauthId: id,
      email: emails?.[0].value,
      givenName: name?.givenName,
      familyName: name?.familyName,
    };
    const user = await this.googleAuthService.attemptAuthentication(userInfo);
    done(null, false);
  }
}
