import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from '@/chat/chat.gateway';
import { Chat } from '@/chat/domain/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatGateway],
})
export class ChatModule {}
