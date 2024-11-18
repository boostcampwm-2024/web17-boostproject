import {
  ArgumentsHost,
  Catch,
  Inject,
  WsExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from 'winston';

@Catch(WsException)
export class WebSocketExceptionFilter implements WsExceptionFilter {
  constructor(@Inject('winston') private readonly logger: Logger) {}
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const data = host.switchToWs().getData();
    const errorMessage = exception.message;
    client.emit('error', {
      message: errorMessage,
      data,
    });
    this.logger.warn(`error occurred: ${errorMessage}`);
  }
}
