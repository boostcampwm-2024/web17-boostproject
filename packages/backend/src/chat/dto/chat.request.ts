import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChatScrollRequest {
  @ApiProperty({
    description: '종목 주식 id(종목방 id)',
    example: 'A005930',
  })
  @IsString()
  readonly stockId: string;

  @ApiProperty({
    description: '최신 채팅 id',
    example: 99999,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly latestChatId?: number;

  @ApiProperty({
    description: '페이지 크기',
    example: 20,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly pageSize?: number;
}

export interface ChatScrollQuery {
  stockId: string;
  latestChatId?: number;
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
