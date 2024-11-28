import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { OpenapiTokenApi } from '@/scraper/openapi/api/openapiToken.api';
import { TR_ID } from '@/scraper/openapi/type/openapiUtil.type';
import { getOpenApi } from '@/scraper/openapi/util/openapiUtil.api';
import { PriorityQueue } from '@/scraper/openapi/util/priorityQueue';

export interface Json {
  output: Record<string, string> | Record<string, string>[];
}

export interface OpenapiQueueNodeValue {
  url: string;
  query: object;
  trId: TR_ID;
  callback: <T extends Json>(value: T) => Promise<void>;
}

@Injectable()
export class OpenapiQueue {
  private queue: PriorityQueue<OpenapiQueueNodeValue> = new PriorityQueue();
  constructor() {}

  enqueue(value: OpenapiQueueNodeValue, priority?: number) {
    if (!priority) {
      priority = 2;
    }
    this.queue.enqueue(value, priority);
  }

  dequeue(): OpenapiQueueNodeValue | undefined {
    return this.queue.dequeue();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

@Injectable()
export class OpenapiConsumer {
  private readonly REQUEST_COUNT_PER_SECOND = 20;
  private isProcessing: boolean = false;
  private currentTokenIndex = 0;

  constructor(
    private readonly queue: OpenapiQueue,
    private readonly openapiTokenApi: OpenapiTokenApi,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.start();
  }

  async start() {
    setInterval(() => this.consume(), 1000);
  }

  async consume() {
    if (this.isProcessing) {
      return;
    }

    while (!this.queue.isEmpty()) {
      this.isProcessing = true;
      await this.processQueueRequest();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    this.isProcessing = false;
  }

  private async processQueueRequest() {
    const tokenCount = (await this.openapiTokenApi.configs()).length;
    for (let i = 0; i < tokenCount; i++) {
      await this.processIndividualTokenRequest(this.currentTokenIndex);
      if (!this.isProcessing) {
        return;
      }
      this.currentTokenIndex = (this.currentTokenIndex + 1) % tokenCount;
    }
  }

  private async processIndividualTokenRequest(index: number) {
    for (let i = 0; i < this.REQUEST_COUNT_PER_SECOND; i++) {
      const node = this.queue.dequeue();
      if (!node) {
        return (this.isProcessing = false);
      }
      try {
        const data = await getOpenApi(
          node.url,
          (await this.openapiTokenApi.configs())[index],
          node.query,
          node.trId,
        );
        await node.callback(data);
      } catch (error) {
        this.logger.warn(error);
        this.queue.enqueue(node, 1);
      }
    }
  }
}
