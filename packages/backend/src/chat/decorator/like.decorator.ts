import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LikeResponse } from '@/chat/dto/like.response';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ToggleLikeApi() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: '채팅 좋아요 토글 API',
      description: '채팅 좋아요를 토글한다.',
    }),
    ApiOkResponse({
      description: '좋아요 성공',
      type: LikeResponse,
    }),
    ApiBadRequestResponse({
      description: '채팅이 존재하지 않음',
      example: {
        message: 'Chat not found',
        error: 'Bad Request',
        statusCode: 400,
      },
    }),
  );
}
