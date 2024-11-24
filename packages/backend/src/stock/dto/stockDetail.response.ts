import { ApiProperty } from '@nestjs/swagger';

export class StockDetailResponse {
  @ApiProperty({
    description: '주식의 시가 총액',
    example: 352510000000000,
  })
  marketCap: number;

  @ApiProperty({
    description: '주식의 이름',
    example: '삼성전자',
  })
  name: string;

  @ApiProperty({
    description: '주식의 EPS',
    example: 4091,
  })
  eps: number;

  @ApiProperty({
    description: '주식의 PER',
    example: 17.51,
  })
  per: number;

  @ApiProperty({
    description: '주식의 52주 최고가',
    example: 88000,
  })
  high52w: number;

  @ApiProperty({
    description: '주식의 52주 최저가',
    example: 53000,
  })
  low52w: number;
}
