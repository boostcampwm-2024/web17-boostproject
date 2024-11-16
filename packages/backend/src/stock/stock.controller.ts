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
import { StockViewsResponse } from '@/stock/dto/stock.Response';
import { StockViewRequest } from '@/stock/dto/stockView.request';
import {
  UserStockDeleteRequest,
  UserStockRequest,
} from '@/stock/dto/userStock.request';
import {
  UserStockOwnerResponse,
  UserStockResponse,
} from '@/stock/dto/userStock.response';
import { User } from '@/user/domain/user.entity';

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
    const stock = await this.stockService.createUserStock(
      user.id,
      requestBody.stockId,
    );
    return new UserStockResponse(
      Number(stock.identifiers[0].id),
      '사용자 소유 주식을 추가했습니다.',
    );
  }

  @Delete('/user')
  @ApiCookieAuth(sessionConfig.name)
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
    await this.stockService.deleteUserStock(user.id, request.userStockId);
    return new UserStockResponse(
      request.userStockId,
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
    @Body() body: UserStockRequest,
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
