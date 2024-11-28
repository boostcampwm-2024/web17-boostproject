import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StockViewRequest {
  @ApiProperty({
    example: 'A005930',
    description: '개별 주식 id',
  })
  @IsString()
  stockId: string;

  constructor(stockId: string) {
    this.stockId = stockId;
  }
}
