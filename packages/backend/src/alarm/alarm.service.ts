import {
  BadRequestException,
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
import { StockMinutely } from '@/stock/domain/stockData.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    private readonly dataSource: DataSource,
    private readonly pushService: PushService,
  ) {}

  private isAlarmNotExpired(
    expiredDate: Date,
    recent: StockMinutely | StockLiveData,
  ): boolean {
    const updatedAt =
      (recent as StockLiveData).updatedAt ||
      (recent as StockMinutely).createdAt;
    return updatedAt && expiredDate >= updatedAt;
  }

  private isTargetPriceMet(
    targetPrice: number,
    recent: StockMinutely | StockLiveData,
  ): boolean {
    return targetPrice <= recent.open;
  }

  private isTargetVolumeMet(
    targetVolume: number,
    recent: StockMinutely | StockLiveData,
  ): boolean {
    return targetVolume <= recent.volume;
  }

  isValidAlarmCompareEntity(
    alarm: Partial<Alarm>,
    recent: StockMinutely | StockLiveData,
  ): boolean {
    if (
      alarm.alarmExpiredDate &&
      this.isAlarmNotExpired(alarm.alarmExpiredDate, recent)
    ) {
      return true;
    }
    if (alarm.targetPrice && this.isTargetPriceMet(alarm.targetPrice, recent)) {
      return true;
    }
    if (
      alarm.targetVolume &&
      this.isTargetVolumeMet(alarm.targetVolume, recent)
    ) {
      return true;
    }
    return false;
  }

  private validAlarmThrow(
    alarm: Partial<Alarm>,
    recent: StockMinutely | StockLiveData,
  ) {
    if (
      alarm.alarmExpiredDate &&
      !this.isAlarmNotExpired(alarm.alarmExpiredDate, recent)
    )
      throw new BadRequestException(
        `${alarm.alarmExpiredDate}는 잘못된 날짜입니다. 다시 입력해주세요.`,
      );

    if (alarm.targetPrice && this.isTargetPriceMet(alarm.targetPrice, recent))
      throw new BadRequestException(
        `${alarm.targetPrice}원은 최근 가격보다 낮습니다. 다시 입력해주세요.`,
      );

    if (
      alarm.targetVolume &&
      this.isTargetVolumeMet(alarm.targetVolume, recent)
    )
      throw new BadRequestException(
        `${alarm.targetVolume}은 최근 거래량보다 낮습니다. 다시 입력해주세요.`,
      );
  }

  async validAlarmThrowException(
    alarmData: AlarmRequest,
    stockId: string = alarmData.stockId,
  ) {
    const recentLiveData = await this.dataSource.manager.findOne(
      StockLiveData,
      {
        where: { stock: { id: stockId } },
      },
    );

    if (recentLiveData) {
      this.validAlarmThrow(alarmData, recentLiveData);
    }

    const recentMinuteData = await this.dataSource.manager.findOne(
      StockMinutely,
      {
        where: { stock: { id: stockId } },
        order: { startTime: 'DESC' },
      },
    );

    if (recentMinuteData) {
      this.validAlarmThrow(alarmData, recentMinuteData);
    }

    return true;
  }

  async create(alarmData: AlarmRequest, userId: number) {
    await this.validAlarmThrowException(alarmData);
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

  async findByStockId(stockId: string, userId: number) {
    const result = await this.alarmRepository.find({
      where: { stock: { id: stockId }, user: { id: userId } },
      relations: ['user', 'stock'],
    });

    return result.map((val) => new AlarmResponse(val));
  }

  async findOne(id: number) {
    const result = await this.alarmRepository.findOne({
      where: { id },
      relations: ['stock'],
    });

    if (result) return new AlarmResponse(result);
    else throw new NotFoundException('등록된 알림을 찾을 수 없습니다.');
  }

  async update(id: number, updateData: AlarmRequest) {
    await this.validAlarmThrowException(updateData);
    const alarm = await this.alarmRepository.findOne({ where: { id } });
    if (!alarm) {
      throw new NotFoundException('등록된 알림을 찾을 수 없습니다.');
    }

    await this.alarmRepository.update(id, {
      stock: { id: updateData.stockId },
      targetVolume: updateData.targetVolume,
      targetPrice: updateData.targetPrice,
      alarmExpiredDate: updateData.alarmExpiredDate,
    });
    const updatedAlarm = await this.alarmRepository.findOne({
      where: { id },
      relations: ['stock'],
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
      //한번만 보내고 삭제하게 처리.
      this.alarmRepository.delete(alarm.id);
    }
  }
}
