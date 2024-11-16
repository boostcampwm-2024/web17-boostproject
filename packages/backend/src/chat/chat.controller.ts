import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ChatService } from '@/chat/chat.service';
import { ChatScrollRequest } from '@/chat/dto/chat.request';
import { ChatScrollResponse } from '@/chat/dto/chat.response';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: '채팅 스크롤 조회 API',
    description: '채팅을 스크롤하여 조회한다.',
  })
  @ApiOkResponse({
    description: '스크롤 조회 성공',
    type: ChatScrollResponse,
  })
  @ApiBadRequestResponse({
    description: '스크롤 크기 100 초과',
    example: {
      message: 'pageSize should be less than 100',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Get()
  async findChatList(@Query() request: ChatScrollRequest) {
    return await this.chatService.scrollNextChat(
      request.stockId,
      request.latestChatId,
      request.pageSize,
    );
  }
}
