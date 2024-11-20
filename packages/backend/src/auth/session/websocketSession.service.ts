import { MemoryStore } from 'express-session';
import { Socket } from 'socket.io';
import { websocketCookieParse } from '@/auth/session/cookieParser';
import { PassportSession } from '@/auth/session/webSocketSession.guard';

export class WebsocketSessionService {
  constructor(private readonly sessionStore: MemoryStore) {}

  async getAuthenticatedUser(socket: Socket) {
    const cookieValue = websocketCookieParse(socket);
    const session = await this.getSession(cookieValue);
    return session ? session.passport.user : undefined;
  }

  private getSession(cookieValue: string) {
    return new Promise<PassportSession | undefined>((resolve) => {
      this.sessionStore.get(cookieValue, (err: Error, session) => {
        if (err || !session) {
          resolve(undefined);
        }
        resolve(session as PassportSession);
      });
    });
  }
}
