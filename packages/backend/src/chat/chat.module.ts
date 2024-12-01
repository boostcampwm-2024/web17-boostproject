import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '@/auth/session.module';
import { ChatController } from '@/chat/chat.controller';
import { ChatGateway } from '@/chat/chat.gateway';
import { ChatService } from '@/chat/chat.service';
import { Chat } from '@/chat/domain/chat.entity';
import { Like } from '@/chat/domain/like.entity';
import { Mention } from '@/chat/domain/mention.entity';
import { LikeService } from '@/chat/like.service';
import { MentionService } from '@/chat/mention.service';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Like, Mention]),
    StockModule,
    SessionModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, LikeService, MentionService],
})
export class ChatModule {}
