import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiGetStockData } from './decorator/stockData.decorator';
import { StockDetailResponse } from './dto/stockDetail.response';
import { StockService } from './stock.service';
import {
  StockDataDailyService,
  StockDataMinutelyService,
  StockDataMonthlyService,
  StockDataWeeklyService,
  StockDataYearlyService,
} from './stockData.service';
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
    private readonly stockDataMinutelyService: StockDataMinutelyService,
    private readonly stockDataDailyService: StockDataDailyService,
    private readonly stockDataWeeklyService: StockDataWeeklyService,
    private readonly stockDataMonthlyService: StockDataMonthlyService,
    private readonly stockDataYearlyService: StockDataYearlyService,
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

  @Get(':stockId/minutely')
  @ApiGetStockData('주식 분 단위 데이터 조회 API', '분')
  async getStockDataMinutely(
    @Param('stockId') stockId: string,
    @Query('lastStartTime') lastStartTime?: string,
  ) {
    return this.stockDataMinutelyService.getStockDataMinutely(
      stockId,
      lastStartTime,
    );
  }

  @Get(':stockId/daily')
  @ApiGetStockData('주식 일 단위 데이터 조회 API', '일')
  async getStockDataDaily(
    @Param('stockId') stockId: string,
    @Query('lastStartTime') lastStartTime?: string,
  ) {
    return this.stockDataDailyService.getStockDataDaily(stockId, lastStartTime);
  }

  @Get(':stockId/weekly')
  @ApiGetStockData('주식 주 단위 데이터 조회 API', '주')
  async getStockDataWeekly(
    @Param('stockId') stockId: string,
    @Query('lastStartTime') lastStartTime?: string,
  ) {
    return this.stockDataWeeklyService.getStockDataWeekly(
      stockId,
      lastStartTime,
    );
  }

  @Get(':stockId/mothly')
  @ApiGetStockData('주식 월 단위 데이터 조회 API', '월')
  async getStockDataMonthly(
    @Param('stockId') stockId: string,
    @Query('lastStartTime') lastStartTime?: string,
  ) {
    return this.stockDataMonthlyService.getStockDataMonthly(
      stockId,
      lastStartTime,
    );
  }

  @Get(':stockId/yearly')
  @ApiGetStockData('주식 연 단위 데이터 조회 API', '연')
  async getStockDataYearly(
    @Param('stockId') stockId: string,
    @Query('lastStartTime') lastStartTime?: string,
  ) {
    return this.stockDataYearlyService.getStockDataYearly(
      stockId,
      lastStartTime,
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
