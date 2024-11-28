import { ApiProperty } from '@nestjs/swagger';
import { UserStock } from '@/stock/domain/userStock.entity';

export class UserStockResponse {
  @ApiProperty({ description: '소유 주식 id', example: '005930' })
  id: string;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자 소유 주식을 추가했습니다.',
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

export class UserStockOwnerResponse {
  @ApiProperty({ description: '사용자 주식 소유 여부', example: true })
  isOwner: boolean;

  @ApiProperty({
    description: '응답 date',
    example: new Date(),
  })
  date: Date;

  constructor(isOwner: boolean) {
    this.isOwner = isOwner;
    this.date = new Date();
  }
}

class UserStockResult {
  @ApiProperty({
    description: '유저 주식 id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '종목 id',
    example: '005930',
  })
  stockId: string;

  @ApiProperty({
    description: '종목 이름',
    example: '삼성전자',
  })
  name: string;

  @ApiProperty({
    description: '거래 가능 여부',
    example: true,
  })
  isTrading: boolean;

  @ApiProperty({
    description: '그룹 코드',
    example: 'A',
  })
  groupCode: string;

  @ApiProperty({
    description: '생성일',
    example: new Date(),
  })
  createdAt: Date;
}

export class UserStocksResponse {
  @ApiProperty({
    description: '사용자 주식 정보',
    type: [UserStockResult],
  })
  userStocks: UserStockResult[];

  constructor(userStocks: UserStock[]) {
    this.userStocks = userStocks.map((userStock) => ({
      id: userStock.id,
      stockId: userStock.stock.id,
      name: userStock.stock.name,
      isTrading: userStock.stock.isTrading,
      groupCode: userStock.stock.groupCode,
      createdAt: userStock.date.createdAt,
    }));
  }
}
