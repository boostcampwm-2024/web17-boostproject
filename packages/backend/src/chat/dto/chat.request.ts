import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChatScrollQuery {
  @ApiProperty({
    description: '종목 주식 id(종목방 id)',
    example: '005930',
  })
  @IsString()
  stockId: string;

  @ApiProperty({
    description: '최신 채팅 id',
    example: 99999,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latestChatId?: number;

  @ApiProperty({
    description: '페이지 크기',
    example: 20,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pageSize?: number;
}

export function isChatScrollQuery(object: unknown): object is ChatScrollQuery {
  if (typeof object !== 'object' || object === null) {
    return false;
  }
  if (!('stockId' in object) || typeof object.stockId !== 'string') {
    return false;
  }
  if (
    'latestChatId' in object &&
    !Number.isInteger(Number(object.latestChatId))
  ) {
    return false;
  }
  return !('pageSize' in object && !Number.isInteger(Number(object.pageSize)));
}

export class SortedChatScrollQuery extends ChatScrollQuery {
  @ApiProperty({
    description: '정렬 기준(기본은 최신 순)',
    example: 'latest',
    enum: ['latest', 'like'],
    required: false,
  })
  @IsOptional()
  order: string;
}

export interface ChatMessage {
  room: string;
  content: string;
  nickname: string;
  subName: string;
}
