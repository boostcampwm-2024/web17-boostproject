import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserStockRequest {
  @ApiProperty({
    example: '005930',
    description: '주식 종목 id',
  })
  @IsString()
  stockId: string;
}

export class UserStockDeleteRequest {
  @ApiProperty({
    example: '005390',
    description: '종목 id',
  })
  @IsString()
  stockId: string;
}
