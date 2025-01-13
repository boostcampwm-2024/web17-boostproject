// 정렬 전략을 위한 인터페이스
import { SelectQueryBuilder } from 'typeorm';
import { Stock } from '@/stock/domain/stock.entity';
import { Injectable } from '@nestjs/common';


export interface StockSortStrategy {
  getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number): Promise<any>;
}

// 조회수 기준 정렬 전략
@Injectable()
export class ViewsSortStrategy implements StockSortStrategy {
  async getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number) {
    return queryBuilder
      .orderBy('stock.views', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}

// 상승률 기준 정렬 전략
@Injectable()
export class GainersSortStrategy implements StockSortStrategy {
  async getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number) {
    return queryBuilder
      .innerJoinAndSelect('stock.fluctuationRankStocks', 'rank')
      .where('rank.isRising = :isRising', { isRising: true })
      .orderBy('rank.rank', 'ASC')
      .limit(limit)
      .getRawMany();
  }
}

// 하락률 기준 정렬 전략
@Injectable()
export class LosersSortStrategy implements StockSortStrategy {
  async getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number) {
    return queryBuilder
      .innerJoinAndSelect('stock.fluctuationRankStocks', 'rank')
      .where('rank.isRising = :isRising', { isRising: false })
      .orderBy('rank.rank', 'ASC')
      .limit(limit)
      .getRawMany();
  }
}
