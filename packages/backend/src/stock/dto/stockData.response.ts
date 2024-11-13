import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PriceDto {
  startTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export class VolumeDto {
  startTime: Date;
  volume: number;
  color: string;
}

export class StockDataResponse {
  @ApiProperty({
    description: '가격 데이터 배열 (날짜 오름차순)',
  })
  @Type(() => PriceDto)
  priceDtoList: PriceDto[];

  @ApiProperty({
    description: '거래량 데이터 배열 (날짜 오름차순, 색 포함)',
  })
  @Type(() => VolumeDto)
  volumeDtoList: VolumeDto[];

  @ApiProperty({
    description: '스크롤해서 불러올 수 있는 데이터가 더 존재하는지',
  })
  hasMore: boolean;
}
