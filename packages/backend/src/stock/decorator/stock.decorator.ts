/* eslint-disable @typescript-eslint/naming-convention */
import {
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  applyDecorators,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StocksResponse } from '../dto/stock.Response';

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
