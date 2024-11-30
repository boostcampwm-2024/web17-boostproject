import { ApiProperty } from '@nestjs/swagger';

export class AlarmRequest {
  @ApiProperty({
    description: '주식 아이디',
    example: '005930',
  })
  stock_id: string;

  @ApiProperty({
    description: '목표 가격',
    example: 150.0,
    required: false,
  })
  targetPrice?: number;

  @ApiProperty({
    description: '목표 거래량',
    example: 1000,
    required: false,
  })
  targetVolum?: number;

  @ApiProperty({
    description: '알림 날짜',
    example: '2023-10-01T00:00:00Z',
    required: false,
  })
  alarmDate?: Date;
}
