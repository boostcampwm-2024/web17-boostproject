import { DataSource, EntityManager } from 'typeorm';
import { OauthType } from '@/user/domain/ouathType';
import { UserService } from '@/user/user.service';

export function createDataSourceMock(
  managerMock: Partial<EntityManager>,
): Partial<DataSource> {
  return {
    transaction: jest.fn().mockImplementation(async (work) => {
      return work(managerMock);
    }),
  };
}

describe('UserService 테스트', () => {
  const registerRequest = {
    email: 'test@naver.com',
    type: OauthType.GOOGLE,
    nickname: 'test',
    oauthId: '123123231242141',
  };

  test('유저를 생성한다', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(false),
      save: jest.fn().mockResolvedValue(registerRequest),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    await userService.register(registerRequest);

    expect(dataSource.transaction).toHaveBeenCalled();
    expect(managerMock.save).toHaveBeenCalled();
    expect(managerMock.exists).toHaveBeenCalled();
  });

  test('이미 존재하는 유저가 생성하려고 하면 예외가 발생한다', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(registerRequest),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    await expect(
      async () => await userService.register(registerRequest),
    ).rejects.toThrow('user already exists');
  });
});
