import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ApiGetStocks, LimitQuery } from './decorator/stock.decorator';
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
import SessionGuard from '@/auth/session/session.guard';
import { GetUser } from '@/common/decorator/user.decorator';
import { sessionConfig } from '@/configs/session.config';
import { StockSearchRequest } from '@/stock/dto/stock.request';
import {
  StockSearchResponse,
  StockViewsResponse,
} from '@/stock/dto/stock.response';
import { StockViewRequest } from '@/stock/dto/stockView.request';
import {
  UserStockDeleteRequest,
  UserStockRequest,
} from '@/stock/dto/userStock.request';
import {
  UserStockOwnerResponse,
  UserStockResponse,
  UserStocksResponse,
} from '@/stock/dto/userStock.response';
import { User } from '@/user/domain/user.entity';

const TIME_UNIT = {
  MINUTE: 'minute',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

type TIME_UNIT = (typeof TIME_UNIT)[keyof typeof TIME_UNIT];

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
  @ApiCookieAuth(sessionConfig.name)
  @ApiOperation({
    summary: '유저 소유 주식 추가 API',
    description: '유저가 소유 주식을 추가한다.',
  })
  @ApiOkResponse({
    description: '유저 소유 주식 추가 성공',
    type: UserStockResponse,
  })
  @UseGuards(SessionGuard)
  async createUserStock(
    @Body() requestBody: UserStockRequest,
    @GetUser() user: User,
  ): Promise<UserStockResponse> {
    await this.stockService.createUserStock(user.id, requestBody.stockId);
    return new UserStockResponse(
      requestBody.stockId,
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
  @UseGuards(SessionGuard)
  async deleteUserStock(
    @Body() request: UserStockDeleteRequest,
    @GetUser() user: User,
  ): Promise<UserStockResponse> {
    await this.stockService.deleteUserStock(user.id, request.stockId);
    return new UserStockResponse(
      request.stockId,
      '사용자 소유 주식을 삭제했습니다.',
    );
  }

  @ApiOperation({
    summary: '유저 소유 주식 확인 API',
    description: '유저가 소유 주식을 확인한다.',
  })
  @ApiOkResponse({
    description: '유저 소유 확인',
    type: UserStockOwnerResponse,
  })
  @Get('user/ownership')
  async checkOwnership(
    @Query() body: UserStockRequest,
    @Req() request: Request,
  ) {
    const user = request.user as User;
    if (!user) {
      return new UserStockOwnerResponse(false);
    }
    const result = await this.stockService.isUserStockOwner(
      body.stockId,
      user.id,
    );
    return new UserStockOwnerResponse(result);
  }

  @Get('/user')
  @ApiOperation({
    summary: '유저 주식 조회 API',
    description: '유저 주식을 조회',
  })
  @ApiOkResponse({
    description: '유저 주식 조회 성공',
    type: UserStocksResponse,
  })
  async getUserStocks(@Req() request: Request) {
    const user = request.user as User;
    return await this.stockService.getUserStocks(user?.id);
  }

  @ApiOperation({
    summary: '주식 검색 API',
    description: '주식 이름에 매칭되는 주식을 검색',
  })
  @ApiOkResponse({
    description: '검색 완료',
    type: StockSearchResponse,
  })
  @Get()
  async searchStock(@Query() request: StockSearchRequest) {
    return await this.stockService.searchStock(request.name);
  }

  @Get('topViews')
  @ApiGetStocks('조회수 기반 주식 리스트 조회 API')
  async getTopStocksByViews(@LimitQuery(5) limit: number) {
    return await this.stockService.getTopStocksByViews(limit);
  }

  @Get('topGainers')
  @ApiGetStocks('가격 상승률 기반 주식 리스트 조회 API')
  async getTopStocksByGainers(@LimitQuery(20) limit: number) {
    return await this.stockService.getTopStocksByGainers(limit);
  }

  @Get('topLosers')
  @ApiGetStocks('가격 하락률 기반 주식 리스트 조회 API')
  async getTopStocksByLosers(@LimitQuery(20) limit: number) {
    return await this.stockService.getTopStocksByLosers(limit);
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

  @Get('/:stockId')
  @ApiGetStockData('주식 시간 단위 데이터 조회 API', '일')
  async getStockDataDaily(
    @Param('stockId') stockId: string,
    @Query('lastStartTime') lastStartTime?: string,
    @Query('timeunit') timeunit: TIME_UNIT = TIME_UNIT.MINUTE,
  ) {
    switch (timeunit) {
      case TIME_UNIT.MINUTE:
        return this.getMinutelyData(stockId, lastStartTime);
      case TIME_UNIT.DAY:
        return this.getDailyData(stockId, lastStartTime);
      case TIME_UNIT.MONTH:
        return this.getStockDataMonthly(stockId, lastStartTime);
      case TIME_UNIT.WEEK:
        return this.getStockDataWeekly(stockId, lastStartTime);
      default:
        return this.getStockDataYearly(stockId, lastStartTime);
    }
  }

  private getStockDataYearly(
    stockId: string,
    lastStartTime: string | undefined,
  ) {
    return this.stockDataYearlyService.getStockDataYearly(
      stockId,
      lastStartTime,
    );
  }

  private getStockDataWeekly(
    stockId: string,
    lastStartTime: string | undefined,
  ) {
    return this.stockDataWeeklyService.getStockDataWeekly(
      stockId,
      lastStartTime,
    );
  }

  private getStockDataMonthly(
    stockId: string,
    lastStartTime: string | undefined,
  ) {
    return this.stockDataMonthlyService.getStockDataMonthly(
      stockId,
      lastStartTime,
    );
  }

  private getMinutelyData(stockId: string, lastStartTime?: string) {
    return this.stockDataMinutelyService.getStockDataMinutely(
      stockId,
      lastStartTime,
    );
  }

  private getDailyData(stockId: string, lastStartTime?: string) {
    return this.stockDataDailyService.getStockDataDaily(stockId, lastStartTime);
  }
}
