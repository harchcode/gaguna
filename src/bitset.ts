const MAX = 0b111111111111111111111111111111;
const WORD_SIZE = 32;
const WORD_LOG = 5;

export class Bitset {
  private values: number[] = [];

  constructor(initialValue: number[] | string = [], base = WORD_SIZE) {
    if (typeof initialValue === "string") {
      this.values = [];

      for (let i = 0; i < initialValue.length; i++) {
        this.values.push(parseInt(initialValue[i], base));
      }
    } else {
      this.values = initialValue;
    }
  }

  private expand(neededSize: number) {
    let size = this.values.length * WORD_SIZE;

    while (size < neededSize) {
      this.values.push(0);

      size += WORD_SIZE;
    }
  }

  private getArrayIndex(index: number) {
    this.expand(index + 1);

    return index >>> WORD_LOG;
  }

  set(index: number) {
    const arrayIndex = this.getArrayIndex(index);

    this.values[arrayIndex] |= 1 << index;
  }

  clear(index: number) {
    const arrayIndex = this.getArrayIndex(index);

    this.values[arrayIndex] &= ~(1 << index);
  }

  any() {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] > 0) return true;
    }

    return false;
  }

  none() {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] > 0) return false;
    }

    return true;
  }

  reset() {
    this.values.length = 0;
  }

  test(index: number) {
    const arrayIndex = this.getArrayIndex(index);

    return (this.values[arrayIndex] & (1 << index)) > 0;
  }

  flip(index: number) {
    const arrayIndex = this.getArrayIndex(index);

    this.values[arrayIndex] ^= 1 << index;
  }

  couht() {
    let r = 0;

    for (let i = 0; i < this.values.length; i++) {
      let n = this.values[i];

      while (n) {
        r += n & 1;
        n >>= 1;
      }
    }

    return r;
  }

  toArray() {
    return this.values;
  }

  toString(base = WORD_SIZE) {
    const r: string[] = [];

    for (let i = 0; i < this.values.length; i++) {
      r.push(this.values[i].toString(base));
    }

    return r.join("");
  }
}

export class Bitset32 {
  private value = 0;

  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  any() {
    return this.value > 0;
  }

  none() {
    return this.value === 0;
  }

  reset() {
    this.value = 0;
  }

  test(index: number) {
    return (this.value & (1 << index)) > 0;
  }

  setAll() {
    this.value = MAX;
  }

  set(index: number) {
    this.value |= 1 << index;
  }

  clear(index: number) {
    this.value &= ~(1 << index);
  }

  flipAll() {
    this.value ^= MAX;
  }

  flip(index: number) {
    this.value ^= 1 << index;
  }

  couht() {
    let r = 0;
    let n = this.value;

    while (n) {
      r += n & 1;
      n >>= 1;
    }

    return r;
  }

  getValue() {
    return this.value;
  }

  getSize() {
    return WORD_SIZE;
  }
}

export function createBitset32(initialValue = 0) {
  return new Bitset32(initialValue);
}

export function createBitset(initialValue: number[] | string = []) {
  return new Bitset(initialValue);
}
