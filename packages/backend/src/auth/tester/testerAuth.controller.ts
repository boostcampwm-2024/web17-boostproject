import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TestAuthGuard } from '@/auth/tester/guard/tester.guard';

@ApiTags('Auth')
@Controller('auth/tester')
export class TesterAuthController {
  constructor() {}

  @ApiOperation({
    summary: '테스터 로그인 api',
    description: '테스터로 로그인합니다.',
  })
  @Get('/login')
  @UseGuards(TestAuthGuard)
  async handleLogin(@Res() response: Response) {
    response.redirect('/');
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
