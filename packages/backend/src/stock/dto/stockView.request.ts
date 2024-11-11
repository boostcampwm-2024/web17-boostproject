import { ApiProperty } from '@nestjs/swagger';

export class StockViewRequest {
  @ApiProperty({
    example: 'A005930',
    description: '개별 주식 id',
  })
  stockId: string;

  constructor(stockId: string) {
    this.stockId = stockId;
  }
}
