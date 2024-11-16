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
