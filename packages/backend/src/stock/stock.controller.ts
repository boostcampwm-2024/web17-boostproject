import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { StockService } from './stock.service';

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
}
