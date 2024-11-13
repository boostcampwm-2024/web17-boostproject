import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: Error | null, user: User) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(
    user: User,
    done: (err: Error | null, user: User | null) => void,
  ): Promise<void> {
    return user ? done(null, user) : done(null, null);
  }
}
