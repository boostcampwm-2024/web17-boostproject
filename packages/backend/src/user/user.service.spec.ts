/* eslint-disable max-lines-per-function */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { User } from './domain/user.entity';
import { OauthType } from '@/user/domain/ouathType';
import { UserService } from '@/user/user.service';

export function createDataSourceMock(
  managerMock?: Partial<EntityManager>,
): Partial<DataSource> {
  const defaultManagerMock: Partial<EntityManager> = {
    findOne: jest.fn(),
    save: jest.fn(),
    exists: jest.fn(),
  };

  return {
    getRepository: managerMock.getRepository,
    transaction: jest.fn().mockImplementation(async (work) => {
      return work({ ...defaultManagerMock, ...managerMock });
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

  test('유저 테마를 업데이트한다', async () => {
    const userId = 1;
    const isLight = false;
    const mockUser = { id: userId, isLight: true };

    const managerMock = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      save: jest.fn().mockResolvedValue({ ...mockUser, isLight }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    const result = await userService.updateUserTheme(userId, isLight);

    expect(dataSource.transaction).toHaveBeenCalled();
    expect(managerMock.findOne).toHaveBeenCalledWith(User, {
      where: { id: userId },
    });
    expect(managerMock.save).toHaveBeenCalledWith({ ...mockUser, isLight });
    expect(result.isLight).toBe(isLight);
  });

  test('isLight가 제공되지 않으면 BadRequestException을 발생시킨다', async () => {
    const managerMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    await expect(userService.updateUserTheme(1)).rejects.toThrow(
      BadRequestException,
    );
  });

  test('유저가 존재하지 않으면 NotFoundException을 발생시킨다', async () => {
    const userId = 1;
    const isLight = true;

    const managerMock = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    await expect(userService.updateUserTheme(userId, isLight)).rejects.toThrow(
      NotFoundException,
    );
  });

  test('유저 테마를 가져온다', async () => {
    const userId = 1;
    const isLight = true;
    const mockUser = { id: userId, isLight };

    const managerMock = {
      findOne: jest.fn().mockResolvedValue(mockUser),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    const result = await userService.getUserTheme(userId);

    expect(managerMock.findOne).toHaveBeenCalledWith(User, {
      where: { id: userId },
      select: ['isLight'],
    });
    expect(result).toBe(isLight);
  });

  test('유저가 존재하지 않을 경우 NotFoundException을 발생시킨다', async () => {
    const userId = 1;

    const managerMock = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const dataSource = createDataSourceMock(managerMock);
    const userService = new UserService(dataSource as DataSource);

    await expect(userService.getUserTheme(userId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
