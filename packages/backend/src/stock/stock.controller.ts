import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { StockViewRequest } from '@/stock/dto/stockView.request';
import { UserStockResponse } from '@/stock/dto/userStock.response';

type MessageResponse = {
  stockId?: number;
  message: string;
};

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @HttpCode(200)
  @Post('/view')
  @ApiOperation({
    summary: '개별 주식 조회수 증가 API',
    description: '개별 주식 조회수를 증가시킨다.',
  })
  @ApiCreatedResponse({
    description: '유저를 생성한다.',
  })
  async increaseStock(
    @Body() request: StockViewRequest,
  ): Promise<MessageResponse> {
    await this.stockService.increaseView(request.stockId);
    return { message: '주식 조회수가 증가했습니다.' };
  }

  @Post('/user')
  async createUserStock(
    @Body() request: { userId: number; stockId: string },
  ): Promise<UserStockResponse> {
    const stock = await this.stockService.createUserStock(
      request.userId,
      request.stockId,
    );
    return {
      id: Number(stock.identifiers[0].id),
      message: '사용자 소유 주식을 추가했습니다.',
      date: new Date(),
    };
  }

  @Delete('/user')
  async deleteUserStock(
    @Body() request: { userId: number; userStockId: number },
  ): Promise<UserStockResponse> {
    await this.stockService.deleteUserStock(
      Number(request.userId),
      request.userStockId,
    );
    return {
      id: request.userStockId,
      message: '사용자 소유 주식을 삭제했습니다.',
      date: new Date(),
    };
  }
}
