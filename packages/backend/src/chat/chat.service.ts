import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';

interface ChatMessage {
  message: string;
  stockId: string;
}

@Injectable()
export class ChatService {
  constructor(private readonly dataSource: DataSource) {}

  async saveChat(userId: number, chatMessage: ChatMessage) {
    return this.dataSource.manager.save(Chat, {
      user: { id: userId },
      stock: { id: chatMessage.stockId },
      message: chatMessage.message,
    });
  }
}