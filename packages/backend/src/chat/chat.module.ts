import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '@/auth/session.module';
import { ChatController } from '@/chat/chat.controller';
import { ChatGateway } from '@/chat/chat.gateway';
import { ChatService } from '@/chat/chat.service';
import { Chat } from '@/chat/domain/chat.entity';
import { Like } from '@/chat/domain/like.entity';
import { StockModule } from '@/stock/stock.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Like]), StockModule, SessionModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
