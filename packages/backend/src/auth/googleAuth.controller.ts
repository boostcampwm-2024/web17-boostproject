import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GoogleAuthGuard } from '@/auth/guard/google.guard';
import { User } from '@/user/domain/user.entity';

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
      message: 'Google Authentication',
    };
  }

  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() request: Request) {
    const user = request.user as User;
    return { nickname: user.nickname, email: user.email };
  }

  @ApiOperation({
    summary: '로그인 상태 확인',
    description: '로그인 상태를 확인합니다.',
  })
  @ApiOkResponse({
    description: '로그인된 상태',
    example: { message: 'Authenticated' },
  })
  @Get('/status')
  async user(@Req() request: Request) {
    if (request.user) {
      return { message: 'Authenticated' };
    }
    return { message: 'Not Authenticated' };
  }
}
