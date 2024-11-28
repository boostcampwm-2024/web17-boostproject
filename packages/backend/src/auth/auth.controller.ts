import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { sessionConfig } from '@/configs/session.config';
import { User } from '@/user/domain/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 진행한다.',
  })
  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: 'Failed to logout', error: err });
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res
            .status(500)
            .send({ message: 'Failed to destroy session', error: destroyErr });
        }
        res.clearCookie(sessionConfig.name || 'connect.sid');
        return res.status(200).send({ message: 'Logged out successfully' });
      });
    });
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
      const user = request.user as User;
      return {
        message: 'Authenticated',
        nickname: user.nickname,
        subName: user.subName,
      };
    }
    return { message: 'Not Authenticated', nickname: null, subName: null };
  }
}
