import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '@/auth/session.module';
import { ChatGateway } from '@/chat/chat.gateway';
import { Chat } from '@/chat/domain/chat.entity';
import { StockModule } from '@/stock/stock.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), StockModule, SessionModule],
  providers: [ChatGateway],
})
export class ChatModule {}
