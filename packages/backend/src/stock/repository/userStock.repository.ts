import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStock } from '@/stock/domain/userStock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserStockRepository {
  constructor(
    @InjectRepository(UserStock)
    private readonly userStockRepository: Repository<UserStock>,
  ) {}

  exists(userId: number, stockId: string) {
    return this.userStockRepository.exists({
      where: {
        user: { id: userId },
        stock: { id: stockId },
      },
    });
  }

  findByUserIdWithStock(userId: number) {
    return this.userStockRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['stock'],
    });
  }

  findByUserIdAndStockId(userId: number, stockId: string) {
    return this.userStockRepository.findOne({
      where: {
        user: { id: userId },
        stock: { id: stockId },
      },
      relations: ['user'],
    });
  }

  create(userId: number, stockId: string) {
    return this.userStockRepository.insert({
      user: { id: userId },
      stock: { id: stockId },
    });
  }

  delete(userStockId: number) {
    return this.userStockRepository.delete(userStockId);
  }
}
