import { ApiProperty } from '@nestjs/swagger';

export class StockViewsResponse {
  @ApiProperty({
    description: '응답 메시지',
    example: 'A005930',
  })
  id: string;

  @ApiProperty({
    description: '응답 메시지',
    example: '주식 조회수가 증가되었습니다.',
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
