import { ApiProperty } from '@nestjs/swagger';
import { StockLiveData } from '../domain/stockLiveData.entity';

class StockIndexRateResponse {
  name: string;

  currentPrice: number;

  changeRate: number;

  @ApiProperty({ description: '거래량', example: 10000 })
  volume: number;

  @ApiProperty({ description: '최고가', example: 1050 })
  high: number;

  @ApiProperty({ description: '최저가', example: 950 })
  low: number;

  @ApiProperty({ description: '시가', example: 980 })
  open: number;

  @ApiProperty({
    description: '마지막 업데이트 날짜',
    example: '2023-10-01T00:00:00Z',
  })
  updatedAt: Date;

  constructor(stockLiveData: StockLiveData) {
    this.name = stockLiveData.stock.name;
    this.currentPrice = stockLiveData.currentPrice;
    this.changeRate = stockLiveData.changeRate;
    this.volume = stockLiveData.volume;
    this.high = stockLiveData.high;
    this.low = stockLiveData.low;
    this.open = stockLiveData.open;
    this.updatedAt = stockLiveData.updatedAt;
  }
}

export class StockIndexResponse extends StockIndexRateResponse {
  @ApiProperty({ description: '주가 지표 이름', example: '코스피' })
  name: string;

  @ApiProperty({ description: '현재 지수', example: 2500 })
  currentPrice: number;

  @ApiProperty({ description: '거래량', example: 0 })
  changeRate: number;

  constructor(stockLiveData: StockLiveData) {
    super(stockLiveData);
  }
}

export class StockRateResponse extends StockIndexRateResponse {
  @ApiProperty({ description: '환율 지표 이름', example: '원 달러 환율' })
  name: string;

  @ApiProperty({ description: '현재 환율', example: 1400 })
  currentPrice: number;

  @ApiProperty({ description: '거래량', example: 0 })
  changeRate: number;

  constructor(stockLiveData: StockLiveData) {
    super(stockLiveData);
  }
}
