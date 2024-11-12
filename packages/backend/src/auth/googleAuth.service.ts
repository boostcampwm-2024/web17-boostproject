import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthUserInfo } from '@/auth/google.strategy';
import { UserService } from '@/user/user.service';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly userService: UserService) {}

  async attemptAuthentication(userInfo: OauthUserInfo) {
    const { email, givenName, familyName, oauthId, type } = userInfo;
    const user = await this.userService.findUserByOauthIdAndType(oauthId, type);
    if (user) {
      return user;
    }
    if (!email) {
      throw new UnauthorizedException('email is required');
    }
    if (!givenName && !familyName) {
      throw new UnauthorizedException('name is required');
    }
    return await this.userService.register({
      type,
      nickname: this.createName(givenName, familyName),
      email: email as string,
      oauthId,
    });
  }

  private createName(givenName?: string, familyName?: string) {
    return `${givenName ? `${givenName} ` : ''}${familyName ? familyName : ''}`.trim();
  }
}
