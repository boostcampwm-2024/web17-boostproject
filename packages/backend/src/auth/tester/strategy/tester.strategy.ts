import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TesterAuthService } from '@/auth/tester/testerAuth.service';

@Injectable()
export class TesterStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly testerAuthService: TesterAuthService) {
    super();
  }

  async validate(username: string, password: string, done: CallableFunction) {
    const user = await this.testerAuthService.attemptAuthentication();
    done(null, user);
  }
}
