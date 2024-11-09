import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { UserStockResponse } from '@/stock/dto/userStock.response';

export type stockViewRequest = {
  id: string;
};

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @HttpCode(200)
  @Post('/view')
  async increaseStock(@Body() request: stockViewRequest): Promise<void> {
    await this.stockService.increaseView(request.id);
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
