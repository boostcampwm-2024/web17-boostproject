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
  private readonly logger = new Logger('HttpTraceLogger');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    // 새로운 추적 컨텍스트 시작
    const traceContext = new TraceContext(requestId);

    return new Observable(subscriber => {
      TraceStore.getStore().run(traceContext, () => {
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

        next.handle().pipe(
          tap({
            next: (data) => {
              const executionTime = Date.now() - startTime;
              // traceContext.addLog(`[Response] ${JSON.stringify(data)}`);
              traceContext.addLog(`[Execution Time] ${executionTime}ms`);

              const logs = traceContext.getLogs();
              this.logger.log(
                `Request ${requestId}\n${logs.join('\n')}\n` +
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
                `Request ${requestId}\n${logs.join('\n')}\n` +
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
}

/**
 * Service와 Repository 메서드 추적을 위한 데코레이터
 */
export function Trace() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const traceContext = TraceStore.getStore().getStore();
      if (!traceContext) {
        return originalMethod.apply(this, args);
      }

      const className = target.constructor.name;
      const startTime = Date.now();

      traceContext.increaseDepth();
      traceContext.addLog(`[${className}.${propertyKey}] Started`);

      try {
        const result = await originalMethod.apply(this, args);
        const executionTime = Date.now() - startTime;

        traceContext.addLog(`[${className}.${propertyKey}] Completed (${executionTime}ms)`);
        traceContext.decreaseDepth();

        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;
        traceContext.addLog(`[${className}.${propertyKey}] Failed (${executionTime}ms): ${error}`);
        traceContext.decreaseDepth();
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 클래스의 모든 메서드에 추적을 적용하는 데코레이터
 * 서비스 클래스위에 사용
 * typeorm이 잘 작동되지않아서 보류
 */
export function TraceClass(
  options: Partial<{ excludeMethods: string[]; includePrivateMethods: boolean }> = {}
) {
  return function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    // 원본 프로토타입 저장
    const originalPrototype = constructor.prototype;

    // 각 메서드에 대해 처리
    Object.getOwnPropertyNames(originalPrototype).forEach((methodName) => {
      // 제외할 메서드 체크
      if (
        methodName === 'constructor' ||
        (!options.includePrivateMethods && methodName.startsWith('_')) ||
        options.excludeMethods?.includes(methodName)
      ) {
        return;
      }

      const descriptor = Object.getOwnPropertyDescriptor(originalPrototype, methodName);
      if (!descriptor || typeof descriptor.value !== 'function') {
        return;
      }

      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const traceContext = TraceStore.getStore().getStore();
        if (!traceContext) {
          return originalMethod.apply(this, args);
        }

        const className = constructor.name;
        const startTime = Date.now();

        traceContext.increaseDepth();
        traceContext.addLog(`[${className}.${methodName}] Started`);

        try {
          // originalMethod를 this에 바인딩하여 호출
          const result = await originalMethod.apply(this, args);
          const executionTime = Date.now() - startTime;

          traceContext.addLog(`[${className}.${methodName}] Completed (${executionTime}ms)`);
          traceContext.decreaseDepth();

          // 원본 메서드의 반환값을 그대로 유지
          return result;
        } catch (error) {
          const executionTime = Date.now() - startTime;
          traceContext.addLog(
            `[${className}.${methodName}] Failed (${executionTime}ms): ${error}`
          );
          traceContext.decreaseDepth();
          throw error;
        }
      };

      // 메서드의 프로토타입 체인 유지
      if (originalMethod.prototype) {
        descriptor.value.prototype = originalMethod.prototype;
      }

      Object.defineProperty(originalPrototype, methodName, descriptor);
    });

    return constructor;
  };
}