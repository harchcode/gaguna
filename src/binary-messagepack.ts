import { absInt, minInt, nextPowerOf2 } from ".";

const typeMap = {
  uint: 0,
  int: 1,
  bool: 2,
  str: 3,
  list: 4,
  bigint: 5,
  map: 6,
  null: 7
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class BMWriter {
  private arr: Uint8Array;
  private offset = 0; // in byte
  private reminder = 8; // in bit

  constructor(initialSize = 16) {
    this.arr = new Uint8Array(initialSize);
  }

  reset(size = 16) {
    this.arr = new Uint8Array(size);
    this.offset = 0;
    this.reminder = 8;
  }

  expand(neededSize: number) {
    const size = this.arr.byteLength;

    if (size >= neededSize) return;

    const newSize = nextPowerOf2(neededSize);
    const newArr = new Uint8Array(newSize);

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

  write(n: unknown) {
    this.expand(this.offset + 1);

    if (n === null || n === undefined) {
      this.writePartial(typeMap.null, 3);
    } else if (Array.isArray(n)) {
      this.writePartial(typeMap.list, 3);
      this.writeList(n);
    } else if (typeof n === "object" && n !== null && n !== undefined) {
      this.writePartial(typeMap.map, 3);
      this.writeMap(n);
    } else if (typeof n === "number") {
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

  private writeString(n: string) {
    const encoded = encoder.encode(n);
    const strSize = encoded.byteLength;

    this.writeInt(strSize);

    this.expand(this.offset + strSize + 1);

    for (let i = 0; i < encoded.length; i++) {
      this.writePartial(encoded[i], 8);
    }
  }

  private writeList(n: unknown[]) {
    this.writeInt(n.length);

    for (let i = 0; i < n.length; i++) {
      this.write(n[i]);
    }
  }

  private writeMap(n: Record<string, unknown> | Record<never, never>) {
    const keys = Object.keys(n);

    this.writeInt(keys.length);

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const v = (n as Record<string, unknown>)[k];

      this.writeString(k);
      this.write(v);
    }
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

  readNext(nullValue: null | undefined = null) {
    const type = this.readPartial(3);

    switch (type) {
      case typeMap.null:
        return nullValue;
      case typeMap.uint:
        return this.readInt(false);
      case typeMap.int:
        return this.readInt(true);
      case typeMap.bool:
        return this.readBoolean();
      case typeMap.str:
        return this.readString();
      case typeMap.list:
        return this.readList();
      case typeMap.map:
        return this.readMap();
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

    const x = new Uint8Array(strSize);

    for (let i = 0; i < strSize; i++) {
      x[i] = this.readPartial(8);
    }

    return decoder.decode(x);
  }

  private readList() {
    const length = this.readInt();
    const r: unknown[] = [];

    for (let i = 0; i < length; i++) {
      r.push(this.readNext());
    }

    return r;
  }

  private readMap() {
    const length = this.readInt();
    const r: Record<string, unknown> = {};

    for (let i = 0; i < length; i++) {
      const k = this.readString();
      const v = this.readNext();

      r[k] = v;
    }

    return r;
  }
}
