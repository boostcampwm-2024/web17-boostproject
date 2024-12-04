type HeapNode<T> = { value: T; priority: number; order: number };

export class PriorityQueue<T> {
  private heap: HeapNode<T>[] = [];
  private count: number = 0;

  enqueue(value: T, priority: number) {
    this.heap.push({ value, priority, order: this.count++ });
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
    const result = this.heap.length === 0;
    if (!result) {
      return result;
    }
    this.count = 0;
    return result;
  }

  clear() {
    this.heap = [];
    this.count = 0;
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

    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (!this.compare(this.heap[index], this.heap[parentIndex])) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private compare(a: HeapNode<T>, b: HeapNode<T>) {
    if (a.priority === b.priority) {
      return a.order < b.order;
    }
    return a.priority < b.priority;
  }

  private heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (
        rightChildIndex < this.heap.length &&
        this.compare(this.heap[rightChildIndex], this.heap[smallerChildIndex])
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.compare(this.heap[index], this.heap[smallerChildIndex])) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }
}
