import { Inject, Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Logger } from 'winston';
import { AlarmService } from './alarm.service';
import { Alarm } from './domain/alarm.entity';
import { StockMinutely } from '@/stock/domain/stockData.entity';

@Injectable()
@EventSubscriber()
export class AlarmSubscriber
  implements EntitySubscriberInterface<StockMinutely>
{
  constructor(
    private readonly datasource: DataSource,
    private readonly alarmService: AlarmService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.datasource.subscribers.push(this);
  }

  listenTo() {
    return StockMinutely;
  }

  async afterInsert(event: InsertEvent<StockMinutely>) {
    try {
      const stockMinutely = event.entity;
      const rawAlarms = await this.datasource.manager.find(Alarm, {
        where: { stock: { id: stockMinutely.stock.id } },
        relations: ['user', 'stock'],
      });
      const alarms = rawAlarms.filter((val) =>
        this.alarmService.isValidAlarmCompareEntity(val, stockMinutely),
      );
      for (const alarm of alarms) {
        await this.alarmService.sendPushNotification(alarm);
      }
    } catch (error) {
      this.logger.warn(`Failed to handle alarm afterInsert event : ${error}`);
    }
  }
}
