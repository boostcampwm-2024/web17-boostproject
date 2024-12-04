import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmController } from './alarm.controller';
import { AlarmService } from './alarm.service';
import { AlarmSubscriber } from './alarm.subscriber';
import { Alarm } from './domain/alarm.entity';
import { PushSubscription } from './domain/subscription.entity';
import { PushController } from './push.controller';
import { PushService } from './push.service';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm, PushSubscription])],
  controllers: [AlarmController, PushController],
  providers: [AlarmService, PushService, AlarmSubscriber],
  exports: [AlarmService],
})
export class AlarmModule {}
