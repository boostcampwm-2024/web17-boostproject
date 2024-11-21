import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alarm } from './domain/alarm.entity';
import { AlarmRequest } from './dto/alarm.request';
import { PushService } from './webPush.service';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    private readonly dataSource: DataSource,
    private readonly pushService: PushService,
  ) {}

  async create(alarmData: Partial<Alarm>): Promise<Alarm> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      const newAlarm = repository.create(alarmData);
      const savedAlarm = await repository.save(newAlarm);
      return savedAlarm;
    });
  }

  async findByUserId(userId: number): Promise<Alarm[]> {
    return await this.alarmRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'stock'],
    });
  }

  async findByStockId(stockId: string): Promise<Alarm[]> {
    return await this.alarmRepository.find({
      where: { stock: { id: stockId } },
      relations: ['user', 'stock'],
    });
  }

  async findOne(id: number) {
    return await this.alarmRepository.findOne({
      where: { id },
      relations: ['user', 'stock'],
    });
  }

  async update(id: number, updateData: AlarmRequest) {
    const alarm = await this.alarmRepository.findOne({ where: { id } });
    if (!alarm) {
      throw new NotFoundException(`Alarm with ID ${id} not found`);
    }

    await this.alarmRepository.update(id, updateData);
    const updatedAlarm = await this.alarmRepository.findOne({
      where: { id },
      relations: ['user', 'stock'],
    });
    return updatedAlarm!;
  }

  async delete(id: number) {
    const alarm = await this.alarmRepository.findOne({ where: { id } });
    if (!alarm) {
      throw new NotFoundException(`Alarm with ID ${id} not found`);
    }

    await this.alarmRepository.delete(id);
  }

  private async sendPushNotification(alarm: Alarm): Promise<void> {
    const { user, stock, targetPrice, targetVolume } = alarm;

    const payload = {
      title: '주식 알림',
      body: `${stock.name}: ${
        targetPrice ? `가격이 ${targetPrice}에 도달했습니다.` : ''
      } ${targetVolume ? `거래량이 ${targetVolume}에 도달했습니다.` : ''}`,
    };

    for (const subscription of user.subscriptions) {
      await this.pushService.sendPushNotification(subscription, payload);
    }
  }
}
