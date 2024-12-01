import { anything, instance, mock, when } from 'ts-mockito';
import { DataSource, EntityManager } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
import { Like } from '@/chat/domain/like.entity';
import { LikeService } from '@/chat/like.service';
import { Stock } from '@/stock/domain/stock.entity';
import { User } from '@/user/domain/user.entity';

function createChat(): Chat {
  return {
    stock: { id: '005930', name: '삼성전자' } as Stock,
    user: new User(),
    id: 1,
    likeCount: 1,
    message: '안녕하세요',
    mentions: [],
    type: 'NORMAL',
    date: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

describe('LikeService 테스트', () => {
  let likeService: LikeService;
  let datasourceMock: DataSource;
  let managerMock: EntityManager;

  test('존재하지 않는 채팅을 좋아요를 시도하면 예외가 발생한다.', async () => {
    datasourceMock = mock(DataSource);
    managerMock = mock(EntityManager);
    when(managerMock.findOne(Chat, anything())).thenResolve(null);
    when(datasourceMock.transaction(anything())).thenCall(async (callback) => {
      return await callback(instance(managerMock));
    });

    likeService = new LikeService(instance(datasourceMock));

    await expect(() => likeService.toggleLike(1, 1)).rejects.toThrow(
      'Chat not found',
    );
  });

  test('특정 채팅에 좋아요를 한다.', async () => {
    const chat = createChat();
    datasourceMock = mock(DataSource);
    managerMock = mock(EntityManager);
    when(managerMock.findOne(Chat, anything()))
      .thenResolve(chat)
      .thenResolve(null);
    when(datasourceMock.transaction(anything())).thenCall(async (callback) => {
      return await callback(instance(managerMock));
    });
    likeService = new LikeService(instance(datasourceMock));

    const response = await likeService.toggleLike(1, 1);

    expect(response.likeCount).toBe(2);
  });

  test('특정 채팅에 좋아요를 취소한다.', async () => {
    const chat = createChat();
    datasourceMock = mock(DataSource);
    managerMock = mock(EntityManager);
    when(managerMock.findOne(Chat, anything())).thenResolve(chat);
    when(managerMock.findOne(Like, anything())).thenResolve(new Like());
    when(datasourceMock.transaction(anything())).thenCall(async (callback) => {
      return await callback(instance(managerMock));
    });
    likeService = new LikeService(instance(datasourceMock));

    const response = await likeService.toggleLike(1, 1);

    expect(response.likeCount).toBe(0);
  });
});
