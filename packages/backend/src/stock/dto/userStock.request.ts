import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class UserStockRequest {
  @ApiProperty({
    example: 'A005930',
    description: '주식 종목 id',
  })
  @IsString()
  stockId: string;
}

export class UserStockDeleteRequest {
  @ApiProperty({
    example: 1,
    description: '유저 소유 주식 id',
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  userStockId: number;
}
