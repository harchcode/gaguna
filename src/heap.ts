export class Heap<T> {
  private data: T[] = [];

  private getLeftChildIndex(index: number) {
    return index * 2 + 1;
  }

  private getRightChildIndex(index: number) {
    return index * 2 + 2;
  }

  private getParentIndex(index: number) {
    return ((index - 1) / 2) | 0;
  }

  private hasGreaterChild(index: number) {
    const { data } = this;

    const leftIndex = this.getLeftChildIndex(index);
    const rightIndex = this.getRightChildIndex(index);

    return (
      (data[leftIndex] && data[leftIndex] > data[index]) ||
      (data[rightIndex] && data[rightIndex] > data[index])
    );
  }

  private calculateLargerChildIndex(index: number) {
    const { data } = this;

    const leftIndex = this.getLeftChildIndex(index);
    const rightIndex = this.getRightChildIndex(index);

    if (!data[rightIndex]) return leftIndex;

    if (data[rightIndex] > data[leftIndex]) return rightIndex;

    return leftIndex;
  }

  top() {
    return this.data[0];
  }

  insert(v: T) {
    const { data } = this;

    data.push(v);

    const newNodeIndex = data.length - 1;

    while (newNodeIndex > 0) {
      const parentIndex = this.getParentIndex(newNodeIndex);

      if (data[newNodeIndex] <= data[parentIndex]) break;

      const tmp = data[newNodeIndex];

      data[newNodeIndex] = data[parentIndex];
      data[parentIndex] = tmp;
    }
  }

  pop() {
    const { data } = this;

    const top = data[0];

    data[0] = data.pop() as T;

    const index = 0;

    while (this.hasGreaterChild(index)) {
      const largerChildIndex = this.calculateLargerChildIndex(index);

      const tmp = data[index];
      data[index] = data[largerChildIndex];
      data[largerChildIndex] = tmp;
    }

    return top;
  }
}

export function createHeap() {
  return new Heap();
}
