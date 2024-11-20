import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OauthType } from './domain/ouathType';
import { User } from './domain/user.entity';

type RegisterRequest = Required<
  Pick<User, 'email' | 'nickname' | 'type' | 'oauthId'>
>;

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async register({ nickname, email, type, oauthId }: RegisterRequest) {
    return await this.dataSource.transaction(async (manager) => {
      await this.validateUserExists(type, oauthId, manager);
      const subName = await this.createSubName(nickname);
      return await manager.save(User, {
        nickname,
        email,
        type,
        oauthId,
        subName,
      });
    });
  }

  async createSubName(nickname: string) {
    return this.dataSource.transaction(async (manager) => {
      if (!(await this.existsUserByNickname(nickname, manager))) {
        return '0001';
      }

      const maxSubName = await manager
        .createQueryBuilder(User, 'user')
        .select('MAX(user.subName)', 'max')
        .where('user.nickname = :nickname', { nickname })
        .getRawOne();

      return (parseInt(maxSubName.max, 10) + 1).toString().padStart(4, '0');
    });
  }

  existsUserByNickname(nickname: string, manager: EntityManager) {
    return manager.exists(User, { where: { nickname } });
  }

  async findUserByOauthIdAndType(oauthId: string, type: OauthType) {
    return await this.dataSource.manager.findOne(User, {
      where: { oauthId, type },
    });
  }

  async updateUserTheme(userId: number, isLight?: boolean): Promise<User> {
    return await this.dataSource.transaction(async (manager) => {
      if (isLight === undefined) {
        throw new BadRequestException('isLight property is required');
      }

      const user = await manager.findOne(User, { where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.isLight = isLight;
      return await manager.save(user);
    });
  }

  async getUserTheme(userId: number): Promise<boolean> {
    const user = await this.dataSource.manager.findOne(User, {
      where: { id: userId },
      select: ['isLight'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.isLight;
  }

  private async validateUserExists(
    type: OauthType,
    oauthId: string,
    manager: EntityManager,
  ) {
    if (await manager.exists(User, { where: { oauthId, type } })) {
      throw new BadRequestException('user already exists');
    }
  }
}
