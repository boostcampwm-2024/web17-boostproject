import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { StockViewRequest } from '@/stock/dto/stockView.request';

type MessageResponse = {
  userStockId?: number;
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
}
