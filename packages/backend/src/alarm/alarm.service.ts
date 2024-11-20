import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { Alarm } from './domain/alarm.entity';
import { AlarmRequest } from './dto/alarm.request';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    private readonly dataSource: DataSource,
  ) {}

  async create(alarmData: Partial<Alarm>): Promise<Alarm> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      const newAlarm = repository.create(alarmData);
      return repository.save(newAlarm);
    });
  }

  async findByUserId(userId: number): Promise<Alarm[]> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      return repository.find({
        where: { user: { id: userId } },
        relations: ['user', 'stock'],
      });
    });
  }

  async findByStockId(stockId: string): Promise<Alarm[]> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      return repository.find({
        where: { stock: { id: stockId } },
        relations: ['user', 'stock'],
      });
    });
  }

  async findOne(id: number): Promise<Alarm | null> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      return repository.findOne({
        where: { id },
        relations: ['user', 'stock'],
      });
    });
  }

  async update(id: number, updateData: AlarmRequest): Promise<Alarm> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);

      const alarm = await repository.findOne({ where: { id } });
      if (!alarm) {
        throw new NotFoundException(`Alarm with ID ${id} not found`);
      }

      await repository.update(id, updateData);
      return (
        (await this.alarmRepository.findOne({
          where: { id },
          relations: ['user', 'stock'],
        })) ?? new Alarm()
      );
    });
  }

  async delete(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);

      const alarm = await repository.findOne({ where: { id } });
      if (!alarm) {
        throw new NotFoundException(`Alarm with ID ${id} not found`);
      }

      await repository.delete(id);
    });
  }

  async getMatchingAlarms(
    stockId: string,
    currentPrice: number,
    currentVolume: number,
  ): Promise<Alarm[]> {
    return this.alarmRepository.find({
      where: [
        { stock: { id: stockId }, targetPrice: LessThanOrEqual(currentPrice) },
        {
          stock: { id: stockId },
          targetVolume: LessThanOrEqual(currentVolume),
        },
      ],
    });
  }

  private async sendAlarmNotification(alarm: Alarm): Promise<void> {
    const { user, stock, targetPrice, targetVolume } = alarm;

    const payload = {
      title: '주식 알림',
      body: `${stock.name}: ${
        targetPrice ? `가격이 ${targetPrice}에 도달했습니다.` : ''
      } ${targetVolume ? `거래량이 (${targetVolume}에 도달했습니다.` : ''}`,
    };

    // 웹 푸시 전송

    await this.handleAlarmAfterNotification();
  }

  private async handleAlarmAfterNotification() {}
}
