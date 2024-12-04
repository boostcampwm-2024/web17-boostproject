/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StockDataResponse } from '../dto/stockData.response';

export function ApiGetStockData(summary: string, type: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({
      name: 'stockId',
      type: String,
      description: '주식 ID',
      example: '005930',
    }),
    ApiQuery({
      name: 'lastStartTime',
      required: false,
      description: '마지막 시작 시간 (ISO 8601 형식)',
      example: '2024-04-01T00:00:00.000Z',
      type: String,
      format: 'date-time',
    }),
    ApiQuery({
      name: 'timeunit',
      required: false,
      description: '시간 단위',
      example: 'minute',
      type: String,
      enum: ['minute', 'day', 'week', 'month', 'year'],
    }),
    ApiResponse({
      status: 200,
      description: `주식의 ${type} 단위 데이터 성공적으로 조회`,
      type: StockDataResponse,
    }),
    ApiResponse({
      status: 404,
      description: '주식 데이터가 존재하지 않음',
    }),
  );
}
