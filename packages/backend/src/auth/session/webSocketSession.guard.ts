import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MemoryStore, SessionData } from 'express-session';
import { Socket } from 'socket.io';
import { websocketCookieParse } from '@/auth/session/cookieParser';
import { MEMORY_STORE } from '@/auth/session.module';
import { User } from '@/user/domain/user.entity';

export interface SessionSocket extends Socket {
  session?: User;
}

export interface PassportSession extends SessionData {
  passport: { user: User };
}

@Injectable()
export class WebSocketSessionGuard implements CanActivate {
  constructor(
    @Inject(MEMORY_STORE) private readonly sessionStore: MemoryStore,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: SessionSocket = context.switchToHttp().getRequest();
    const cookieValue = websocketCookieParse(socket);
    const session = await this.getSession(cookieValue);
    socket.session = session.passport.user;
    return true;
  }

  private getSession(cookieValue: string) {
    return new Promise<PassportSession>((resolve, reject) => {
      this.sessionStore.get(cookieValue, (err: Error, session) => {
        if (err || !session) {
          reject(new WsException('forbidden chat'));
        }
        resolve(session as PassportSession);
      });
    });
  }
}
