export class PriorityQueue<T> {
  private heap: { value: T; priority: number }[];

  constructor() {
    this.heap = [];
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return index * 2 + 1;
  }

  private getRightChildIndex(index: number): number {
    return index * 2 + 2;
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[index].priority < this.heap[this.getParentIndex(index)].priority
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].priority <
          this.heap[smallerChildIndex].priority
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[index].priority <= this.heap[smallerChildIndex].priority) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  enqueue(value: T, priority: number) {
    this.heap.push({ value, priority });
    this.heapifyUp();
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const root = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      this.heapifyDown();
    }

    return root.value;
  }

  peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0].value : undefined;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

const pq = new PriorityQueue<string>();

pq.enqueue('Task A', 2);
pq.enqueue('Task B', 1);
pq.enqueue('Task C', 3);

console.log(pq.dequeue()); // Task B
console.log(pq.peek()); // Task A
console.log(pq.dequeue()); // Task A
console.log(pq.isEmpty()); // false
console.log(pq.dequeue()); // Task C
console.log(pq.isEmpty()); // true
