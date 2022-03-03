import { absInt, minInt, nextPowerOf2 } from ".";

const typeMap = {
  uint: 0,
  int: 1,
  bool: 2,
  str: 3,
  list: 4,
  biguint: 5,
  bigint: 6,
  map: 7
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class BMWriter {
  private arr: Uint8Array;
  private offset = 0; // in byte
  private reminder = 8; // in bit

  constructor(initialSize = 16) {
    const buffer = new ArrayBuffer(initialSize);
    this.arr = new Uint8Array(buffer);
  }

  reset(size = 16) {
    const buffer = new ArrayBuffer(size);
    this.arr = new Uint8Array(buffer);
    this.offset = 0;
    this.reminder = 8;
  }

  expand(neededSize: number) {
    const size = this.arr.byteLength;

    if (size >= neededSize) return;

    const newSize = nextPowerOf2(neededSize);
    const newBuffer = new ArrayBuffer(newSize);
    const newArr = new Uint8Array(newBuffer);

    newArr.set(this.arr, 0);

    this.arr = newArr;
  }

  private getNumByteSize(n: number) {
    if (n < 1 << 8) return 1;
    if (n < 1 << 16) return 2;
    if (n < 1 << 24) return 3;

    return 4;
  }

  private writePartial(n: number, bitSize: number) {
    let processed = 0;

    while (processed < bitSize) {
      const unprocessedCount = bitSize - processed;

      const processCount = minInt(this.reminder, unprocessedCount);

      const part =
        processCount === this.reminder
          ? n >>> (unprocessedCount - this.reminder)
          : (n & ((1 << unprocessedCount) - 1)) <<
            (this.reminder - processCount);

      this.arr[this.offset] |= part;

      processed += processCount;
      this.reminder -= processCount;

      if (this.reminder === 0) {
        this.offset++;
        this.reminder = 8;
      }
    }
  }

  write(n: number | boolean | string) {
    this.expand(this.offset + 1);

    if (typeof n === "number") {
      this.writePartial(n < 0 ? typeMap.int : typeMap.uint, 3);
      this.writeInt(n);
    } else if (typeof n === "boolean") {
      this.writePartial(typeMap.bool, 3);
      this.writeBoolean(n);
    } else if (typeof n === "string") {
      this.writePartial(typeMap.str, 3);
      this.writeString(n);
    }
  }

  private writeInt(n: number) {
    n |= 0;
    n = n < 0 ? absInt(n) - 1 : n;

    const size = this.getNumByteSize(n);

    this.expand(this.offset + 1 + size);

    this.writePartial(size - 1, 2);
    this.writePartial(n, size * 8);
  }

  private writeBoolean(n: boolean) {
    this.expand(this.offset + 1);
    this.writePartial(n ? 1 : 0, 1);
  }

  private writeStringPartial = (n: number) => {
    this.writePartial(n, 8);
  };

  private writeString(n: string) {
    const encoded = encoder.encode(n);
    const strSize = encoded.byteLength;

    this.writeInt(strSize);

    this.expand(this.offset + strSize);

    encoded.forEach(this.writeStringPartial);
  }

  getBuffer() {
    return this.arr.buffer.slice(0, this.offset + (this.reminder > 0 ? 1 : 0));
  }
}

export class BMReader {
  private arr: Uint8Array;
  private offset = 0; // in byte
  private reminder = 8; // in bit

  constructor(buffer?: ArrayBuffer) {
    this.arr = buffer ? new Uint8Array(buffer) : new Uint8Array();
  }

  reset(buffer: ArrayBuffer) {
    this.arr = new Uint8Array(buffer);
    this.offset = 0;
    this.reminder = 8;
  }

  private readPartial(bitSize: number) {
    let r = 0;
    let processed = 0;

    while (processed < bitSize) {
      const n = this.arr[this.offset];

      const processCount = minInt(this.reminder, bitSize - processed);

      const part =
        (n >>> (this.reminder - processCount)) & ((1 << processCount) - 1);

      r = (r << processCount) | part;

      processed += processCount;
      this.reminder -= processCount;

      if (this.reminder === 0) {
        this.offset++;
        this.reminder = 8;
      }
    }

    return r;
  }

  readNext() {
    const type = this.readPartial(3);

    switch (type) {
      case typeMap.uint:
        return this.readInt(false);
      case typeMap.int:
        return this.readInt(true);
      case typeMap.bool:
        return this.readBoolean();
      case typeMap.str:
        return this.readString();
      default:
        return 0;
    }
  }

  private readInt(isNegative = false) {
    const size = this.readPartial(2) + 1;
    const n = this.readPartial(size * 8) + (isNegative ? 1 : 0);

    return isNegative ? -n : n;
  }

  private readBoolean() {
    const n = this.readPartial(1);

    return n > 0;
  }

  private readString() {
    const strSize = this.readInt();

    const x = new Uint8Array(new ArrayBuffer(strSize));

    for (let i = 0; i < strSize; i++) {
      x[i] = this.readPartial(8);
    }

    return decoder.decode(x);
  }
}
