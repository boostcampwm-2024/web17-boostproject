import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
  open: number;

  @ApiProperty({
    description: '고가',
    example: '125.00',
  })
  high: number;

  @ApiProperty({
    description: '저가',
    example: '120.00',
  })
  low: number;

  @ApiProperty({
    description: '종가',
    example: '123.45',
  })
  close: number;
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
  volume: number;
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
}
