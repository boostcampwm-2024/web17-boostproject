import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alarm } from './domain/alarm.entity';
import { AlarmRequest } from './dto/alarm.request';
import { PushService } from './push.service';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    private readonly dataSource: DataSource,
    private readonly pushService: PushService,
  ) {}

  async create(alarmData: Partial<Alarm>, userId: number): Promise<Alarm> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      const newAlarm = repository.create({
        ...alarmData,
        user,
      });
      return await repository.save(newAlarm);
    });
  }

  async findByUserId(userId: number): Promise<Alarm[]> {
    return await this.alarmRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'stock'],
    });
  }

  async findByStockId(stockId: string, userId: number): Promise<Alarm[]> {
    return await this.alarmRepository.find({
      where: { stock: { id: stockId }, user: { id: userId } },
      relations: ['user', 'stock'],
    });
  }

  async findOne(id: number) {
    const result = await this.alarmRepository.findOne({
      where: { id },
      relations: ['user', 'stock'],
    });
    if (result) return result;
    else throw new NotFoundException('등록된 알림을 찾을 수 없습니다.');
  }

  async update(id: number, updateData: AlarmRequest) {
    const alarm = await this.alarmRepository.findOne({ where: { id } });
    if (!alarm) {
      throw new NotFoundException('등록된 알림을 찾을 수 없습니다.');
    }

    await this.alarmRepository.update(id, updateData);
    const updatedAlarm = await this.alarmRepository.findOne({
      where: { id },
      relations: ['user', 'stock'],
    });
    if (updatedAlarm) return updatedAlarm;
    else
      throw new NotFoundException(
        `${id} : 업데이트할 알림을 찾을 수 없습니다.`,
      );
  }

  async delete(id: number) {
    const alarm = await this.alarmRepository.findOne({ where: { id } });
    if (!alarm) {
      throw new NotFoundException(`${id} : 삭제할 알림을 찾을 수 없습니다.`);
    }

    await this.alarmRepository.delete(id);
  }

  async sendPushNotification(alarm: Alarm): Promise<void> {
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
