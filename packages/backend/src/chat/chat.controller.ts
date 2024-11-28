import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import SessionGuard from '@/auth/session/session.guard';
import { ChatGateway } from '@/chat/chat.gateway';
import { ChatService } from '@/chat/chat.service';
import { ToggleLikeApi } from '@/chat/decorator/like.decorator';
import { ChatScrollQuery } from '@/chat/dto/chat.request';
import { ChatScrollResponse } from '@/chat/dto/chat.response';
import { LikeRequest } from '@/chat/dto/like.request';
import { LikeService } from '@/chat/like.service';
import { GetUser } from '@/common/decorator/user.decorator';
import { User } from '@/user/domain/user.entity';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly likeService: LikeService,
    private readonly chatGateWay: ChatGateway,
  ) {}

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
  async findChatList(
    @Query() request: ChatScrollQuery,
    @Req() req: Express.Request,
  ) {
    const user = req.user as User;
    return await this.chatService.scrollChat(request, user?.id);
  }

  @UseGuards(SessionGuard)
  @ToggleLikeApi()
  @Post('like')
  async toggleChatLike(@Body() request: LikeRequest, @GetUser() user: User) {
    const result = await this.likeService.toggleLike(user.id, request.chatId);
    this.chatGateWay.broadcastLike(result);
    return result;
  }

  @ApiOperation({
    summary: '채팅 스크롤 조회 API(좋아요 순)',
    description: '좋아요 순으로 채팅을 스크롤하여 조회한다.',
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
  @Get('/like')
  async findChatListByLike(
    @Query() request: ChatScrollQuery,
    @Req() req: Express.Request,
  ) {
    const user = req.user as User;
    return await this.chatService.scrollChatByLike(request, user?.id);
  }
}
