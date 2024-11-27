import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Stock } from '@/stock/domain/stock.entity';

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

export class StocksResponse {
  @ApiProperty({
    description: '주식 종목 코드',
    example: 'A005930',
  })
  id: string;

  @ApiProperty({
    description: '주식 종목 이름',
    example: '삼성전자',
  })
  name: string;

  @ApiProperty({
    description: '주식 현재가',
    example: 100000.0,
  })
  @Transform(({ value }) => parseFloat(value))
  currentPrice: number;

  @ApiProperty({
    description: '주식 변동률',
    example: 2.5,
  })
  @Transform(({ value }) => parseFloat(value))
  changeRate: number;

  @ApiProperty({
    description: '주식 거래량',
    example: 500000,
  })
  @Transform(({ value }) => parseInt(value))
  volume: number;

  @ApiProperty({
    description: '주식 시가 총액',
    example: '500000000000.00',
  })
  marketCap: string;
}

class StockSearchResult {
  @ApiProperty({
    description: '주식 종목 코드',
    example: 'A005930',
  })
  id: string;

  @ApiProperty({
    description: '주식 종목 이름',
    example: '삼성전자',
  })
  name: string;
}

export class StockSearchResponse {
  @ApiProperty({
    description: '주식 검색 결과',
    type: [StockSearchResult],
  })
  searchResults: StockSearchResult[];

  constructor(stocks?: Stock[]) {
    if (!stocks) {
      this.searchResults = [];
      return;
    }
    this.searchResults = stocks.map((stock) => ({
      id: stock.id as string,
      name: stock.name as string,
    }));
  }
}

export class StockRankResponse {
  @ApiProperty({
    description: '주식 종목 코드',
    example: 'A005930',
  })
  id: string;

  @ApiProperty({
    description: '주식 종목 이름',
    example: '삼성전자',
  })
  name: string;

  @ApiProperty({
    description: '주식 현재가',
    example: 100000.0,
  })
  @Transform(({ value }) => parseFloat(value))
  currentPrice: number;

  @ApiProperty({
    description: '주식 변동률',
    example: 2.5,
  })
  @Transform(({ value }) => parseFloat(value))
  changeRate: number;

  @ApiProperty({
    description: '주식 거래량',
    example: 500000,
  })
  @Transform(({ value }) => parseInt(value))
  volume: number;

  @ApiProperty({
    description: '주식 시가 총액',
    example: '500000000000.00',
  })
  marketCap: string;

  @ApiProperty({
    description: '랭킹',
    example: 1,
  })
  rank: number;
}

export class StockRankResponses {
  result: StockRankResponse[];

  constructor(stocks: Record<string, string>[]) {
    console.log(stocks);
    this.result = stocks.map((stock) => ({
      id: stock.id,
      name: stock.name,
      currentPrice: parseFloat(stock.currentPrice),
      volume: parseInt(stock.volume),
      marketCap: stock.marketCap,
      changeRate: parseFloat(stock.rank_fluctuation_rate),
      rank: parseInt(stock.rank_rank),
    }));
  }
}
