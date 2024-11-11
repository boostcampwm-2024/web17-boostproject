import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Logger } from 'winston';

export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('winston') private readonly logger: Logger) {
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
    if (!emails) {
      done(new UnauthorizedException('email is required'), false);
      return;
    }
    if (!name) {
      done(new UnauthorizedException('name is required'), false);
      return;
    }
    const userInfo = {
      type: provider,
      oauthId: id,
      emails: emails[0].value,
      nickname: `${name.givenName} ${name.familyName}`,
    };
    this.logger.info(`google user info: ${JSON.stringify(userInfo)}`);
    done(null, false);
  }
}
