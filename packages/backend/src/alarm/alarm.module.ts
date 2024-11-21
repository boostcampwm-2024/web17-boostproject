import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmController } from './alarm.controller';
import { AlarmService } from './alarm.service';
import { Alarm } from './domain/alarm.entity';
import { PushSubscription } from './domain/subscription.entity';
import { PushService } from './webPush.service';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm, PushSubscription])],
  controllers: [AlarmController],
  providers: [AlarmService, PushService],
})
export class AlarmModule {}
