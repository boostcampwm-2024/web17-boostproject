import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '@/auth/guard/google.guard';

@Controller('auth/google')
export class GoogleAuthController {
  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  async handleLogin() {
    return {
      msg: 'Google Authentication',
    };
  }
}
