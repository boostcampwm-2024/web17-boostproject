import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';

class TraceContext {
  private depth = 0;
  private logs: string[] = [];
  private requestId: string;

  constructor(requestId: string) {
    this.requestId = requestId;
  }

  increaseDepth() {
    this.depth++;
  }

  decreaseDepth() {
    this.depth--;
  }

  addLog(message: string) {
    const indent = '  '.repeat(this.depth);
    this.logs.push(`${indent}${message}`);
  }

  getLogs(): string[] {
    return this.logs;
  }

  getRequestId(): string {
    return this.requestId;
  }
}

class TraceStore {
  private static instance = new AsyncLocalStorage<TraceContext>();

  static getStore() {
    return this.instance;
  }
}

@Injectable()
export class HttpTraceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('TraceLogger');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();

    // HTTP나 WebSocket이 아니면 그냥 통과
    if (contextType !== 'http' && contextType !== 'ws') {
      return next.handle();
    }

    const requestId = this.generateRequestId();
    const startTime = Date.now();
    const traceContext = new TraceContext(requestId);

    return new Observable(subscriber => {
      TraceStore.getStore().run(traceContext, () => {
        // HTTP 요청인 경우
        if (contextType === 'http') {
          const request = context.switchToHttp().getRequest<Request>();
          const { method, url, body, params, query } = request;
          const controller = context.getClass().name;
          const handler = context.getHandler().name;

          traceContext.addLog(`[Request] ${method} ${url}`);
          traceContext.addLog(`[Controller] ${controller}.${handler}`);

          if (Object.keys(params).length > 0) {
            traceContext.addLog(`[Params] ${JSON.stringify(params)}`);
          }
          if (Object.keys(query).length > 0) {
            traceContext.addLog(`[Query] ${JSON.stringify(query)}`);
          }
          if (Object.keys(body).length > 0) {
            traceContext.addLog(`[Body] ${JSON.stringify(body)}`);
          }
        }
        // WebSocket 요청인 경우
        else if (contextType === 'ws') {
          const wsContext = context.switchToWs();
          const client = wsContext.getClient();
          const data = wsContext.getData();
          const controller = context.getClass().name;
          const handler = context.getHandler().name;

          traceContext.addLog(`[WebSocket Event] ${handler}`);
          traceContext.addLog(`[Controller] ${controller}.${handler}`);
          traceContext.addLog(`[Client ID] ${client.id}`);
          if (data) {
            traceContext.addLog(`[Payload] ${JSON.stringify(data)}`);
          }
        }

        next.handle().pipe(
          tap({
            next: (data) => {
              // response 로깅 추가
              traceContext.addLog(`[Response] ${this.formatResponse(data)}`);
              const executionTime = Date.now() - startTime;
              traceContext.addLog(`[Execution Time] ${executionTime}ms`);

              const logs = traceContext.getLogs();
              this.logger.log(
                `${contextType.toUpperCase()} ${requestId}\n${logs.join('\n')}\n` +
                '========================================='
              );

              subscriber.next(data);
              subscriber.complete();
            },
            error: (error) => {
              const executionTime = Date.now() - startTime;
              traceContext.addLog(`[Error] ${error.message}`);
              traceContext.addLog(`[Execution Time] ${executionTime}ms`);

              const logs = traceContext.getLogs();
              this.logger.error(
                `${contextType.toUpperCase()} ${requestId}\n${logs.join('\n')}\n` +
                '========================================='
              );

              subscriber.error(error);
            }
          })
        ).subscribe();
      });
    });
  }

  private generateRequestId(): string {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 응답 데이터를 포맷팅하고 길이를 제한하는 함수
  private formatResponse(data: any, maxLength: number = 500): string {
    const formatted = JSON.stringify(data, null, 2);
    if( formatted === undefined){
      return 'undefined';
    }
    if (formatted.length <= maxLength) {
      return formatted;
    }
    return formatted.substring(0, maxLength) + '... (response truncated)';
  }
}