import { DataSource } from 'typeorm';
import { ChatService } from '@/chat/chat.service';
import { createDataSourceMock } from '@/user/user.service.spec';

describe('ChatService 테스트', () => {
  test('첫 스크롤을 조회시 100개 이상 조회하면 예외가 발생한다.', async () => {
    const dataSource = createDataSourceMock({});
    const chatService = new ChatService(dataSource as DataSource);

    await expect(() =>
      chatService.scrollNextChat('A005930', 1, 101),
    ).rejects.toThrow('pageSize should be less than 100');
  });

  test('100개 이상의 채팅을 조회하려 하면 예외가 발생한다.', async () => {
    const dataSource = createDataSourceMock({});
    const chatService = new ChatService(dataSource as DataSource);

    await expect(() =>
      chatService.scrollFirstChat('A005930', 101),
    ).rejects.toThrow('pageSize should be less than 100');
  });
});
