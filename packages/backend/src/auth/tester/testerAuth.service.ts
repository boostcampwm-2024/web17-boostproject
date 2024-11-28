import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Injectable()
export class TesterAuthService {
  constructor(private readonly userService: UserService) {}

  async attemptAuthentication() {
    return await this.userService.registerTester();
  }
}
