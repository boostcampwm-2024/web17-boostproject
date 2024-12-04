import { PriorityQueue } from '@/scraper/openapi/util/priorityQueue';

describe('priorityQueue', () => {
  let priorityQueue: PriorityQueue<number>;

  beforeEach(() => {
    priorityQueue = new PriorityQueue();
  });

  test('대량의 데이터 셋', () => {
    const size = 1000;
    const priorities: number[] = [];
    for (let i = 0; i < size; i++) {
      const priority = Math.floor(Math.random() * 10);
      priorities.push(priority);
      priorityQueue.enqueue(i, priority);
    }
    let lastPriority = -1;
    while (!priorityQueue.isEmpty()) {
      const current = priorityQueue.dequeue();
      const currentPriority = priorities[current!];
      expect(currentPriority).toBeGreaterThanOrEqual(lastPriority);
      if (currentPriority > lastPriority) {
        lastPriority = currentPriority;
      }
    }
  });

  test('동일 우선순위일 경우 FIFO', () => {
    const size = 1000;
    for (let i = 0; i < size; i++) {
      priorityQueue.enqueue(i, 0);
    }
    for (let i = 0; i < size; i++) {
      expect(priorityQueue.dequeue()).toBe(i);
    }
  });
});
