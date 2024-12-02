import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@/user/domain/user.entity';
import { UserService } from '@/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: Error | null, userId: number) => void,
  ) {
    done(null, user.id);
  }

  async deserializeUser(
    userId: number,
    done: (err: Error | null, user: User | null) => void,
  ): Promise<void> {
    const user = await this.userService.findUserById(userId);
    return user ? done(null, user) : done(null, null);
  }
}
