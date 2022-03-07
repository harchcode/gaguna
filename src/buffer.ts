import { MAX_U32, nextPowerOf2 } from "./math";

const BType = {
  null: 0,
  uint: 1,
  int: 2,
  bigint: 3,
  bool: 4,
  str: 5,
  list: 6,
  map: 7
} as const;
type BType = typeof BType[keyof typeof BType];

type BasicType =
  | typeof BType.uint
  | typeof BType.int
  | typeof BType.bigint
  | typeof BType.bool
  | typeof BType.str;

export type BSchema =
  | [typeof BType.list, BSchema]
  | [typeof BType.list, BSchema, number]
  | [BasicType]
  | [BasicType, number]
  | { [x: string]: BSchema };

export const buint = (bitSize = 32): BSchema => [BType.uint, bitSize];
export const bint = (bitSize = 32): BSchema => [BType.int, bitSize];
export const bbool = (): BSchema => [BType.bool];
export const bstr = (lengthBitSize = 32): BSchema => [BType.str, lengthBitSize];
export const bbigint = (lengthBitSize = 32): BSchema => [
  BType.bigint,
  lengthBitSize
];
export const blist = (elementType: BSchema, lengthBitSize = 32): BSchema => [
  BType.list,
  elementType,
  lengthBitSize
];

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class BufferWriter {
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

  private getBigIntByteSize(n: bigint) {
    for (let i = 1n; i < MAX_U32; i++) {
      if (n < 1n << (i * 8n)) return Number(i);
    }

    return 0;
  }

  private writePartial(n: number, bitSize: number) {
    let processed = 0;

    while (processed < bitSize) {
      const unprocessedCount = bitSize - processed;

      const processCount = Math.min(this.reminder, unprocessedCount);

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

  writeUint(n: number, bitSize = 32) {
    n |= 0;
    bitSize |= 0;

    const byteSize = (bitSize >>> 3) + 1;

    this.expand(this.offset + 1 + byteSize);
    this.writePartial(n, bitSize);
  }

  writeInt(n: number, bitSize = 32) {
    n |= 0;
    bitSize |= 0;

    const byteSize = (bitSize >>> 3) + 1;

    this.expand(this.offset + 1 + byteSize);

    this.writePartial(n < 0 ? 1 : 0, 1);
    this.writePartial(n < 0 ? -n - 1 : n, bitSize - 1);
  }

  writeBoolean(n: boolean) {
    this.expand(this.offset + 1);
    this.writePartial(n ? 1 : 0, 1);
  }

  writeString(n: string, lengthBitSize = 32) {
    lengthBitSize |= 0;

    const encoded = encoder.encode(n);
    const strSize = encoded.byteLength;

    this.writeUint(strSize, lengthBitSize);

    this.expand(this.offset + strSize + 1);

    for (let i = 0; i < encoded.length; i++) {
      this.writePartial(encoded[i], 8);
    }
  }

  writeBigInt(n: bigint, lengthBitSize = 32) {
    lengthBitSize |= 0;

    const isNegative = n < 0;
    n = n < 0 ? -n - 1n : n;

    const size = this.getBigIntByteSize(n);

    this.writeUint(size, lengthBitSize);
    this.writeBoolean(isNegative);

    this.expand(this.offset + 1 + size);

    for (let i = size - 1; i >= 0; i--) {
      const num = Number((n >> BigInt(i * 8)) & 0b11111111n);
      this.writePartial(num, 8);
    }
  }

  writeUintAuto(n: number) {
    n |= 0;

    const size = this.getNumByteSize(n);

    this.expand(this.offset + 1 + size);

    this.writePartial(size - 1, 2);
    this.writePartial(n, size * 8);
  }

  writeIntAuto(n: number) {
    n |= 0;

    const sign = n < 0 ? 1 : 0;

    n = n < 0 ? -n - 1 : n;

    const size = this.getNumByteSize(n);

    this.expand(this.offset + 1 + size);

    this.writePartial(size - 1, 2);
    this.writePartial(sign, 1);
    this.writePartial(n, size * 8 - 1);
  }

  writeStringAuto(n: string) {
    const encoded = encoder.encode(n);
    const strSize = encoded.byteLength;

    this.writeUintAuto(strSize);

    this.expand(this.offset + strSize + 1);

    for (let i = 0; i < encoded.length; i++) {
      this.writePartial(encoded[i], 8);
    }
  }

  writeListAuto(n: unknown[]) {
    this.writeUintAuto(n.length);

    for (let i = 0; i < n.length; i++) {
      this.write(n[i]);
    }
  }

  writeMapAuto(n: Record<string, unknown> | Record<never, never>) {
    const keys = Object.keys(n);

    this.writeUintAuto(keys.length);

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const v = (n as Record<string, unknown>)[k];

      this.writeString(k);
      this.write(v);
    }
  }

  writeBigIntAuto(n: bigint) {
    const isNegative = n < 0;
    n = n < 0 ? -n - 1n : n;

    const size = this.getBigIntByteSize(n);

    this.writeUintAuto(size);
    this.writeBoolean(isNegative);

    this.expand(this.offset + 1 + size);

    for (let i = size - 1; i >= 0; i--) {
      const num = Number((n >> BigInt(i * 8)) & 0b11111111n);
      this.writePartial(num, 8);
    }
  }

  write(n: unknown) {
    this.expand(this.offset + 1);

    if (n === null || n === undefined) {
      this.writePartial(BType.null, 3);
    } else if (Array.isArray(n)) {
      this.writePartial(BType.list, 3);
      this.writeListAuto(n);
    } else if (typeof n === "object" && n !== null && n !== undefined) {
      this.writePartial(BType.map, 3);
      this.writeMapAuto(n);
    } else if (typeof n === "number") {
      this.writePartial(n < 0 ? BType.int : BType.uint, 3);

      n = n < 0 ? -n - 1 : n;
      this.writeUintAuto(n as number);
    } else if (typeof n === "bigint") {
      this.writePartial(BType.bigint, 3);
      this.writeBigIntAuto(n);
    } else if (typeof n === "boolean") {
      this.writePartial(BType.bool, 3);
      this.writeBoolean(n);
    } else if (typeof n === "string") {
      this.writePartial(BType.str, 3);
      this.writeStringAuto(n);
    }
  }

  writeWithSchema(n: unknown, schema: BSchema) {
    if (!Array.isArray(schema)) {
      if (n === null || n === undefined) {
        this.writeBoolean(true);
        return;
      } else {
        this.writeBoolean(false);
      }

      const keys = Object.keys(schema);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];

        this.writeWithSchema((n as Record<string, unknown>)[k], schema[k]);
      }

      return;
    }

    const t = schema[0];

    if (t === BType.list) {
      const tt = schema[1] as BSchema;
      const s = schema[2];
      const arr = n as unknown[];

      this.writeUint(arr.length, s);

      for (let i = 0; i < arr.length; i++) {
        this.writeWithSchema(arr[i], tt);
      }

      return;
    }

    const s = schema[1] as number;

    if (t === BType.uint) {
      this.writeUint(n as number, s);
    } else if (t === BType.int) {
      this.writeInt(n as number, s);
    } else if (t === BType.bool) {
      this.writeBoolean(n as boolean);
    } else if (t === BType.bigint) {
      this.writeBigInt(n as bigint, s);
    } else if (t === BType.str) {
      this.writeString(n as string, s);
    }
  }

  getBuffer() {
    return this.arr.buffer.slice(0, this.offset + (this.reminder > 0 ? 1 : 0));
  }
}

export class BufferReader {
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

      const processCount = Math.min(this.reminder, bitSize - processed);

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

  read(nullValue: null | undefined = null) {
    const type = this.readPartial(3);

    switch (type) {
      case BType.null:
        return nullValue;
      case BType.uint:
        return this.readUintAuto();
      case BType.int:
        return -this.readUintAuto() - 1;
      case BType.bigint:
        return this.readBigIntAuto();
      case BType.bool:
        return this.readBoolean();
      case BType.str:
        return this.readStringAuto();
      case BType.list:
        return this.readListAuto();
      case BType.map:
        return this.readMapAuto();
      default:
        return 0;
    }
  }

  readWithSchema(schema: BSchema, nullValue: null | undefined = null) {
    if (!Array.isArray(schema)) {
      const isNull = this.readBoolean();

      if (isNull) return nullValue;

      const keys = Object.keys(schema);

      const r: Record<string, unknown> = {};

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];

        r[k] = this.readWithSchema(schema[k]);
      }

      return r;
    }

    const t = schema[0];

    if (t === BType.list) {
      const tt = schema[1] as BSchema;
      const s = schema[2];

      const r: unknown[] = [];

      const length = this.readUint(s);

      for (let i = 0; i < length; i++) {
        r.push(this.readWithSchema(tt, nullValue));
      }

      return r;
    }

    const s = schema[1] as number;

    if (t === BType.uint) {
      return this.readUint(s);
    } else if (t === BType.int) {
      return this.readInt(s);
    } else if (t === BType.bool) {
      return this.readBoolean();
    } else if (t === BType.bigint) {
      return this.readBigInt(s);
    } else if (t === BType.str) {
      return this.readString(s);
    }

    return null;
  }

  readUint(bitSize = 32) {
    return this.readPartial(bitSize);
  }

  readInt(bitSize = 32) {
    const signBit = this.readPartial(1);
    const n = this.readPartial(bitSize - 1);

    return signBit === 1 ? -n - 1 : n;
  }

  readBoolean() {
    const n = this.readPartial(1);

    return n > 0;
  }

  readString(lengthBitSize = 32) {
    const strSize = this.readUint(lengthBitSize);

    const x = new Uint8Array(strSize);

    for (let i = 0; i < strSize; i++) {
      x[i] = this.readPartial(8);
    }

    return decoder.decode(x);
  }

  readBigInt(lengthBitSize = 32) {
    const size = this.readUint(lengthBitSize);
    const isNegative = this.readBoolean();

    let r = 0n;

    for (let i = 0; i < size; i++) {
      const num = this.readPartial(8);

      r = (r << 8n) | BigInt(num);
    }

    return isNegative ? -r - 1n : r;
  }

  readUintAuto() {
    const size = this.readPartial(2) + 1;
    return this.readPartial(size * 8);
  }

  readIntAuto() {
    const size = this.readPartial(2) + 1;
    const sign = this.readPartial(1);

    const n = this.readPartial(size * 8 - 1);

    return sign === 0 ? -n - 1 : n;
  }

  readStringAuto() {
    const strSize = this.readUintAuto();

    const x = new Uint8Array(strSize);

    for (let i = 0; i < strSize; i++) {
      x[i] = this.readPartial(8);
    }

    return decoder.decode(x);
  }

  readListAuto() {
    const length = this.readUintAuto();
    const r: unknown[] = [];

    for (let i = 0; i < length; i++) {
      r.push(this.read());
    }

    return r;
  }

  readMapAuto() {
    const length = this.readUintAuto();
    const r: Record<string, unknown> = {};

    for (let i = 0; i < length; i++) {
      const k = this.readString();
      const v = this.read();

      r[k] = v;
    }

    return r;
  }

  readBigIntAuto() {
    const size = this.readUintAuto();
    const isNegative = this.readBoolean();

    let r = 0n;

    for (let i = 0; i < size; i++) {
      const num = this.readPartial(8);

      r = (r << 8n) | BigInt(num);
    }

    return isNegative ? -r - 1n : r;
  }
}

export function createBufferWriter(initialSize = 128) {
  return new BufferWriter(initialSize);
}

export function createBufferReader(buffer?: ArrayBuffer) {
  return new BufferReader(buffer);
}
