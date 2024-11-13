import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OauthType } from './domain/ouathType';
import { User } from './domain/user.entity';

type RegisterRequest = Required<
  Pick<User, 'email' | 'nickname' | 'type' | 'oauthId'>
>;

@Injectable()
export class UserService {
  constructor(private readonly dataSources: DataSource) {}

  async register({ nickname, email, type, oauthId }: RegisterRequest) {
    return await this.dataSources.transaction(async (manager) => {
      await this.validateUserExists(type, oauthId, manager);
      return await manager.save(User, {
        nickname,
        email,
        type,
        oauthId,
      });
    });
  }

  async findUserByOauthIdAndType(oauthId: string, type: OauthType) {
    return await this.dataSources.manager.findOne(User, {
      where: { oauthId, type },
    });
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
