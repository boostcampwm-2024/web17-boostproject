import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import SessionGuard from '@/auth/session/session.guard';

export const WrongAlarmApi = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: '유효하지 않은 알람 입력값으로 인해 예외가 발생했습니다.',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'string',
            example: '알람 조건을 다시 확인해주세요.',
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    UseGuards(SessionGuard),
  );
};
