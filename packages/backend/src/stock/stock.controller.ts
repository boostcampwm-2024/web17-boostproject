import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StockDetailResponse } from './dto/stockDetail.response';
import { StockService } from './stock.service';
import { StockDetailService } from './stockDetail.service';
import { StockViewsResponse } from '@/stock/dto/stock.Response';
import { StockViewRequest } from '@/stock/dto/stockView.request';
import {
  UserStockCreateRequest,
  UserStockDeleteRequest,
} from '@/stock/dto/userStock.request';
import { UserStockResponse } from '@/stock/dto/userStock.response';

@Controller('stock')
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private readonly stockDetailService: StockDetailService,
  ) {}

  @HttpCode(200)
  @Post('/view')
  @ApiOperation({
    summary: '개별 주식 조회수 증가 API',
    description: '개별 주식 조회수를 증가시킨다.',
  })
  @ApiOkResponse({
    description: '주식 조회수 증가 성공',
    type: StockViewsResponse,
  })
  async increaseStock(
    @Body() request: StockViewRequest,
  ): Promise<StockViewsResponse> {
    await this.stockService.increaseView(request.stockId);
    return new StockViewsResponse(
      request.stockId,
      '주식 조회수가 증가했습니다.',
    );
  }

  @Post('/user')
  @ApiOperation({
    summary: '유저 소유 주식 추가 API',
    description: '유저가 소유 주식을 추가한다.',
  })
  @ApiOkResponse({
    description: '유저 소유 주식 추가 성공',
    type: UserStockResponse,
  })
  async createUserStock(
    @Body() request: UserStockCreateRequest,
  ): Promise<UserStockResponse> {
    const stock = await this.stockService.createUserStock(
      request.userId,
      request.stockId,
    );
    return new UserStockResponse(
      Number(stock.identifiers[0].id),
      '사용자 소유 주식을 추가했습니다.',
    );
  }

  @Delete('/user')
  @ApiOperation({
    summary: '유저 소유 주식 삭제 API',
    description: '유저가 소유 주식을 삭제한다.',
  })
  @ApiOkResponse({
    description: '유저 소유 주식 삭제 성공',
    example: {
      userStockId: 1,
      message: '사용자 소유 주식을 삭제했습니다.',
      date: new Date(),
    },
  })
  async deleteUserStock(
    @Body() request: UserStockDeleteRequest,
  ): Promise<UserStockResponse> {
    await this.stockService.deleteUserStock(
      Number(request.userId),
      request.userStockId,
    );
    return new UserStockResponse(
      request.userStockId,
      '사용자 소유 주식을 삭제했습니다.',
    );
  }

  @ApiOperation({
    summary: '주식 상세 정보 조회 API',
    description: '시가 총액, EPS, PER, 52주 최고가, 52주 최저가를 조회합니다',
  })
  @ApiOkResponse({
    description: '주식 상세 정보 조회 성공',
    type: StockDetailResponse,
  })
  @ApiParam({ name: 'stockId', required: true, description: '주식 ID' })
  @Get(':stockId/detail')
  async getStockDetail(
    @Param('stockId') stockId: string,
  ): Promise<StockDetailResponse> {
    return await this.stockDetailService.getStockDetailByStockId(stockId);
  }
}
