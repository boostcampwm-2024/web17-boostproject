import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alarm } from './domain/alarm.entity';
import { PushSubscription } from './domain/subscription.entity';
import { AlarmRequest } from './dto/alarm.request';
import { AlarmResponse } from './dto/alarm.response';
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

  async create(alarmData: AlarmRequest, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new ForbiddenException('유저를 찾을 수 없습니다.');
      }

      const newAlarm = repository.create({
        ...alarmData,
        user,
        stock: { id: alarmData.stockId },
      });
      const result = await repository.save(newAlarm);
      return new AlarmResponse(result);
    });
  }

  async findByUserId(userId: number) {
    const result = await this.alarmRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'stock'],
    });
    return result.map((val) => new AlarmResponse(val));
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
    if (result) return new AlarmResponse(result);
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
    if (updatedAlarm) return new AlarmResponse(updatedAlarm);
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
      stockId: stock.id,
    };

    const subscriptions = await this.dataSource.manager.findBy(
      PushSubscription,
      {
        user: { id: user.id },
      },
    );

    for (const subscription of subscriptions) {
      await this.pushService.sendPushNotification(subscription, payload);
    }
  }
}
