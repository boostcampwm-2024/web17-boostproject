import { ApiProperty } from '@nestjs/swagger';
import { Alarm } from '../domain/alarm.entity';

export class AlarmResponse {
  @ApiProperty({
    description: '알림 아이디',
    example: 10,
  })
  alarmId: number;

  @ApiProperty({
    description: '주식 코드',
    example: '005930',
  })
  stockId: string;

  @ApiProperty({
    description: '목표 주식 가격',
    example: 50000,
    nullable: true,
  })
  targetPrice?: number;

  @ApiProperty({
    description: '목표 주식 거래량',
    example: 10,
    nullable: true,
  })
  targetVolume?: number;

  @ApiProperty({
    description: '알림 만료일',
    example: 10,
    nullable: true,
  })
  alarmDate?: Date;

  constructor(alarm: Alarm) {
    this.alarmId = alarm.id;
    this.stockId = alarm.stock.id;
    this.targetPrice = alarm.targetPrice;
    this.targetVolume = alarm.targetVolume;
    this.alarmDate = alarm.alarmDate;
  }
}

export class AlarmSuccessResponse {
  @ApiProperty({
    description: '성공 메시지',
    example: 'success',
  })
  message: string;
}
