import { createDataSourceMock } from '@/user/user.service.spec';
import { DataSource } from 'typeorm';
import { LikeService } from '@/chat/like.service';
import { Chat } from '@/chat/domain/chat.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { User } from '@/user/domain/user.entity';
import { Like } from '@/chat/domain/like.entity';

function createChat(): Chat {
  return {
    stock: new Stock(),
    user: new User(),
    id: 1,
    likeCount: 1,
    message: '안녕하세요',
    type: 'NORMAL',
    date: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

describe('LikeService 테스트', () => {
  test('존재하지 않는 채팅을 좋아요를 시도하면 예외가 발생한다.', () => {
    const managerMock = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const datasource = createDataSourceMock(managerMock);
    const likeService = new LikeService(datasource as DataSource);

    expect(likeService.toggleLike(1, 1)).rejects.toThrow('Chat not found');
  });

  test('특정 채팅에 좋아요를 한다.', async () => {
    const chat = createChat();
    const managerMock = {
      findOne: jest
        .fn()
        .mockResolvedValueOnce(chat)
        .mockResolvedValueOnce(null),
      save: jest.fn(),
    };
    const datasource = createDataSourceMock(managerMock);
    const likeService = new LikeService(datasource as DataSource);

    const response = await likeService.toggleLike(1, 1);

    expect(response.likeCount).toBe(2);
  });

  test('특정 채팅에 좋아요를 취소한다.', async () => {
    const chat = createChat();
    const managerMock = {
      findOne: jest
        .fn()
        .mockResolvedValueOnce(chat)
        .mockResolvedValueOnce(new Like()),
      remove: jest.fn(),
    };
    const datasource = createDataSourceMock(managerMock);
    const likeService = new LikeService(datasource as DataSource);

    const response = await likeService.toggleLike(1, 1);

    expect(response.likeCount).toBe(0);
  });
});