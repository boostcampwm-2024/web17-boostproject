import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Stock } from './domain/stock.entity';

@Injectable()
export class StockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  existsById(id: string) {
    return this.stockRepository.exists({ where: { id } });
  }

  findById(id: string) {
    return this.stockRepository.findOne({ where: { id } });
  }

  findByName(id: string) {
    return this.stockRepository.find({
      where: {
        isTrading: true,
        name: Like(`%${id}%`),
      },
      take: 10,
    });
  }

  findByTopViews(limit: number) {
    return this.getStocksQuery()
      .orderBy('stock.views', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  findByTopGainers(limit: number) {
    return this.getStocksQuery()
      .innerJoinAndSelect('stock.fluctuationRankStocks', 'rank')
      .where('rank.isRising = :isRising', { isRising: true })
      .orderBy('rank.rank', 'ASC')
      .limit(limit)
      .getRawMany();
  }

  findByTopLosers(limit: number) {
    return this.getStocksQuery()
      .innerJoinAndSelect('stock.fluctuationRankStocks', 'rank')
      .where('rank.isRising = :isRising', { isRising: false })
      .orderBy('rank.rank', 'ASC')
      .limit(limit)
      .getRawMany();
  }

  findAllWithFluctuaions() {
    return this.getStocksQuery()
      .innerJoinAndSelect('stock.fluctuationRankStocks', 'rank')
      .getRawMany();
  }

  async increaseView(id: string) {
    await this.stockRepository.increment({ id }, 'views', 1);
  }

  private getStocksQuery() {
    return this.stockRepository
      .createQueryBuilder('stock')
      .leftJoin(
        'stock_live_data',
        'stockLiveData',
        'stock.id = stockLiveData.stock_id',
      )
      .leftJoin(
        'stock_detail',
        'stockDetail',
        'stock.id = stockDetail.stock_id',
      )
      .select([
        'stock.id AS id',
        'stock.name AS name',
        'stockLiveData.currentPrice AS currentPrice',
        'stockLiveData.changeRate AS changeRate',
        'stockLiveData.volume AS volume',
        'stockDetail.marketCap AS marketCap',
      ]);
  }
}
