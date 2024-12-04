/* eslint-disable @typescript-eslint/naming-convention */
import {
  applyDecorators,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { StockRankResponses, StocksResponse } from '../dto/stock.response';

export function LimitQuery(defaultValue = 5): ParameterDecorator {
  return Query('limit', new DefaultValuePipe(defaultValue), ParseIntPipe);
}

export function ApiGetStocks(summary: string) {
  return applyDecorators(
    ApiOperation({
      summary,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: '주식 리스트의 요소수',
    }),
    ApiResponse({
      status: 200,
      description: `주식 리스트 데이터 성공적으로 조회`,
      type: [StocksResponse],
    }),
  );
}

export function ApiFluctuationQuery() {
  return applyDecorators(
    ApiOperation({
      summary: '등가, 등락률 기반 주식 리스트 조회 API',
      description: '등가, 등락률 기반 주식 리스트를 조회합니다',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description:
        '조회할 리스트 수(기본값: 20, 등가, 등락 모두 받으면 모든 데이터 전송)',
    }),
    ApiQuery({
      name: 'type',
      required: false,
      description: '데이터 타입(기본값: increase, all, increase, decrease)',
      enum: ['increase', 'decrease', 'all'],
    }),
    ApiOkResponse({
      description: '',
      type: [StockRankResponses],
    }),
  );
}
