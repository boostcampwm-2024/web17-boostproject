import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '@/auth/guard/google.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth/google')
export class GoogleAuthController {
  @ApiOperation({
    summary: '구글 로그인 전용 페이지 이동',
    description: '페이지를 이동하여 구글 로그인을 진행합니다.',
  })
  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  async handleLogin() {
    return {
      msg: 'Google Authentication',
    };
  }
}
