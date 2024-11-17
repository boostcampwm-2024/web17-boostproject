import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '@/auth/session.module';
import { ChatGateway } from '@/chat/chat.gateway';
import { Chat } from '@/chat/domain/chat.entity';
import { StockModule } from '@/stock/stock.module';
import { ChatService } from '@/chat/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), StockModule, SessionModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
