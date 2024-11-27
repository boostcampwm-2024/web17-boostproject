import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { sessionConfig } from '@/configs/session.config';

@ApiTags('Auth')
@Controller('auth/logout')
export class LogoutController {
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 진행한다.',
  })
  @Post()
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
}
