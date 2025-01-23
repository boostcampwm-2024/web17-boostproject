import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Like } from 'typeorm';
import { OauthType } from './domain/ouathType';
import { User } from './domain/user.entity';
import { status, subject } from '@/user/constants/randomNickname';
import {
  UserInformationResponse,
  UserSearchResult,
} from '@/user/dto/user.response';

type RegisterRequest = Required<
  Pick<User, 'email' | 'nickname' | 'type' | 'oauthId'>
>;

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {
  }

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

  async searchUserByNicknameAndSubName(nickname: string, subName?: string) {
    const whereCondition = subName
      ? { nickname: Like(`%${nickname}%`), subName: Like(`${subName}%`) }
      : { nickname: Like(`%${nickname}%`) };
    const users = await this.dataSource.manager.find(User, {
      where: whereCondition,
      take: 10,
    });
    return new UserSearchResult(users);
  }

  async searchOneUserByNicknameAndSubName(nickname: string, subName?: string) {
    return await this.dataSource.manager.findOne(User, {
      where: {
        nickname,
        subName,
      },
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

  async findUserById(id: number) {
    return await this.dataSource.manager.findOne(User, { where: { id } });
  }

  async getUserInfo(id: number) {
    const user = await this.dataSource.manager.findOne(User, { where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return new UserInformationResponse(user);
  }

  existsUserByNickname(nickname: string, manager: EntityManager) {
    return manager.exists(User, { where: { nickname } });
  }

  async updateNickname(userId: number, nickname: string) {
    const user = await this.dataSource.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    } else if (user.nickname === nickname) {
      throw new BadRequestException('Same nickname');
    }
    user.nickname = nickname;
    user.subName = await this.createSubName(nickname);
    return await this.dataSource.manager.save(user);
  }

  async registerTester() {
    return this.register({
      nickname: this.generateRandomNickname(),
      email: 'tester@nav',
      type: OauthType.LOCAL,
      oauthId: String((await this.getMaxOauthId(OauthType.LOCAL)) + 1),
    });
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

  private generateRandomNickname() {
    const statusName = status[Math.floor(Math.random() * status.length)];
    const subjectName = subject[Math.floor(Math.random() * subject.length)];
    return `${statusName}${subjectName}`;
  }

  private async getMaxOauthId(oauthType: OauthType) {
    const result = await this.dataSource.manager
      .createQueryBuilder(User, 'user')
      .select('MAX(CAST(user.oauthId AS SIGNED))', 'max')
      .where('user.type = :oauthType', { oauthType })
      .getRawOne();
    return result ? Number(result.max) : 1;
  }

  private async validateUserExists(
    type: OauthType,
    oauthId: string,
    manager: EntityManager,
  ) {
    try {
      await manager.exists(User, { where: { oauthId, type } });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
