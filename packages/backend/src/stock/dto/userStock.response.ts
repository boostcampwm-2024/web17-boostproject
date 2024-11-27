import { ApiProperty } from '@nestjs/swagger';

export class UserStockResponse {
  @ApiProperty({ description: '소유 주식 id', example: '005930' })
  id: string;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자 소유 주식을 추가했습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 date',
    example: new Date(),
  })
  date: Date;

  constructor(id: string, message: string) {
    this.id = id;
    this.message = message;
    this.date = new Date();
  }
}

export class UserStockOwnerResponse {
  @ApiProperty({ description: '사용자 주식 소유 여부', example: true })
  isOwner: boolean;

  @ApiProperty({
    description: '응답 date',
    example: new Date(),
  })
  date: Date;

  constructor(isOwner: boolean) {
    this.isOwner = isOwner;
    this.date = new Date();
  }
}
