import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StockSearchRequest {
  @ApiProperty({
    description: '검색할 단어',
    example: '삼성',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
