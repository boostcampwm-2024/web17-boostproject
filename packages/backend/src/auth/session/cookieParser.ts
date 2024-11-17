import * as crypto from 'node:crypto';
import { WsException } from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Socket } from 'socket.io';
import { sessionConfig } from '@/configs/session.config';

export const websocketCookieParse = (socket: Socket) => {
  if (!socket.request.headers.cookie) {
    throw new WsException('not found cookie');
  }
  const cookies = cookie.parse(socket.request.headers.cookie);
  const sid = cookies['connect.sid'];
  return getSessionIdFromCookie(sid);
};

const getSessionIdFromCookie = (cookieValue: string) => {
  if (cookieValue.startsWith('s:')) {
    const [id, signature] = cookieValue.slice(2).split('.');
    const expectedSignature = crypto
      .createHmac('sha256', sessionConfig.secret)
      .update(id)
      .digest('base64')
      .replace(/=+$/, '');

    if (expectedSignature === signature) {
      return id;
    }
    throw new WsException('Invalid cookie signature');
  }
  throw new WsException('Invalid cookie format');
};
