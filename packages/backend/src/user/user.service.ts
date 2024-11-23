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
      return await manager.save(User, {
        nickname,
        email,
        type,
        oauthId,
      });
    });
  }

  async registerTester() {
    return await this.dataSource.transaction(async (manager) => {
      return await manager.save(User, {
        nickname: this.generateRandomNickname(),
        email: 'tester@nav',
        type: OauthType.LOCAL,
        oauthId: String(
          (await this.getMaxOauthId(OauthType.LOCAL, manager)) + 1,
        ),
      });
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

  private generateRandomNickname(): string {
    const adjectives = [
      '강력한',
      '지혜로운',
      '소중한',
      '빛나는',
      '고요한',
      '용감한',
      '행운의',
      '신비로운',
    ];
    const animals = [
      '호랑이',
      '독수리',
      '용',
      '사슴',
      '백호',
      '하늘새',
      '백두산 호랑이',
      '붉은 여우',
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    return `${randomAdjective} ${randomAnimal}`;
  }

  private async getMaxOauthId(oauthType: OauthType, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder(User, 'user')
      .select('MAX(user.oauthId)', 'max')
      .where('user.type = :oauthType', { oauthType })
      .getRawOne();

    return result ? Number(result.max) : 1;
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
