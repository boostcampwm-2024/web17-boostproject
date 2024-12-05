import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  StockDaily,
  StockData,
  StockWeekly,
} from '@/stock/domain/stockData.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';
import { getToday } from '@/utils/date';

export class PriceDto {
  @ApiProperty({
    description: '시작 시간',
    type: String,
    format: 'date-time',
    example: '2024-04-01T00:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: '시가',
    example: '121.00',
  })
  open: string;

  @ApiProperty({
    description: '고가',
    example: '125.00',
  })
  high: string;

  @ApiProperty({
    description: '저가',
    example: '120.00',
  })
  low: string;

  @ApiProperty({
    description: '종가',
    example: '123.45',
  })
  close: string;

  constructor(stockData: StockData) {
    this.startTime = stockData.startTime;
    this.open = String(stockData.open);
    this.high = String(stockData.high);
    this.low = String(stockData.low);
    this.close = String(stockData.close);
  }
}

export class VolumeDto {
  @ApiProperty({
    description: '시작 시간',
    type: String,
    format: 'date-time',
    example: '2024-04-01T00:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: '거래량',
    example: 1000,
  })
  volume: string;

  constructor(stockData: StockData) {
    this.startTime = stockData.startTime;
    this.volume = String(stockData.volume);
  }
}

export class StockDataResponse {
  @ApiProperty({
    description: '가격 데이터 배열 (날짜 오름차순)',
    type: [PriceDto],
  })
  @Type(() => PriceDto)
  priceDtoList: PriceDto[];

  @ApiProperty({
    description: '거래량 데이터 배열 (날짜 오름차순, 색 포함)',
    type: [VolumeDto],
  })
  @Type(() => VolumeDto)
  volumeDtoList: VolumeDto[];

  @ApiProperty({
    description: '스크롤해서 불러올 수 있는 데이터가 더 존재하는지',
    example: true,
  })
  hasMore: boolean;

  constructor(
    priceDtoList: PriceDto[],
    volumeDtoList: VolumeDto[],
    hasMore: boolean,
  ) {
    this.priceDtoList = priceDtoList;
    this.volumeDtoList = volumeDtoList;
    this.hasMore = hasMore;
  }

  renewLastData(stockLiveData: StockLiveData, entity: new () => StockData) {
    const lastIndex = this.priceDtoList.length - 1;
    this.priceDtoList[lastIndex].close = String(stockLiveData.currentPrice);
    this.renewHighLow(stockLiveData, lastIndex);
    this.renewVolume(stockLiveData, lastIndex, entity);
    this.renewStartTime(entity, lastIndex);
  }

  private renewStartTime(entity: new () => StockData, lastIndex: number) {
    if (entity !== StockWeekly) {
      this.priceDtoList[lastIndex].startTime = getToday();
      this.volumeDtoList[lastIndex].startTime = getToday();
      return;
    }
  }

  private renewHighLow(stockLiveData: StockLiveData, lastIndex: number) {
    this.priceDtoList[lastIndex].high =
      Number(stockLiveData.high) > Number(this.priceDtoList[lastIndex].high)
        ? String(stockLiveData.high)
        : String(this.priceDtoList[lastIndex].high);
    this.priceDtoList[lastIndex].low =
      Number(stockLiveData.low) < Number(this.priceDtoList[lastIndex].low)
        ? String(stockLiveData.low)
        : String(this.priceDtoList[lastIndex].low);
  }

  private renewVolume(
    stockLiveData: StockLiveData,
    lastIndex: number,
    entity: new () => StockData,
  ) {
    this.volumeDtoList[lastIndex].volume =
      entity === StockDaily
        ? String(stockLiveData.volume)
        : String(
            Number(this.volumeDtoList[lastIndex].volume) +
              Number(stockLiveData.volume),
          );
  }
}
