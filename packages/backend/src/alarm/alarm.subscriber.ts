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
import { Stock } from '@/stock/domain/stock.entity';
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
    console.log('eh');
    this.datasource.subscribers.push(this);
    setInterval(() => {
      this.test();
    }, 10000);
  }

  async test() {
    const stockMinutelyData = {
      close: 54200.0,
      low: 53800.0,
      high: 55300.0,
      open: 55100.0,
      volume: 24513531,
      startTime: new Date(),
      createdAt: new Date('2024-12-01 16:48:37'),
      stock: { id: '005930' } as Stock, // Example stock ID, ensure it's valid in your database
    };
    console.log('test');
    await this.datasource.manager.save(StockMinutely, stockMinutelyData);
  }

  listenTo() {
    return StockMinutely;
  }

  async afterInsert(event: InsertEvent<StockMinutely>) {
    try {
      const stockLiveData = event.entity;
      const alarms = await this.datasource.manager.find(Alarm, {
        where: { stock: { id: stockLiveData.stock.id } },
        relations: ['user', 'stock'],
      });
      console.log('after insert');

      for (const alarm of alarms) {
        console.log('in alarm');
        await this.alarmService.sendPushNotification(alarm);
      }
    } catch (error) {
      this.logger.warn(`Failed to handle alarm afterInsert event : ${error}`);
    }
  }
}
