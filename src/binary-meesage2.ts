import { nextPowerOf2 } from ".";

const BNumType = {
  u8: "u8",
  u16: "u16",
  u32: "u32",
  i8: "i8",
  i16: "i16",
  i32: "i32",
  f32: "f32",
  f64: "f64"
} as const;
export type BNumbType = typeof BNumType[keyof typeof BNumType];

const BNumSize = {
  u8: 1,
  u16: 2,
  u32: 4,
  i8: 1,
  i16: 2,
  i32: 4,
  f32: 4,
  f64: 8
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class BufferWriter {
  private dv: DataView;
  private arr: Uint8Array;
  private currentOffset = 0;

  constructor(initialSize = 16) {
    const buffer = new ArrayBuffer(initialSize);

    this.dv = new DataView(buffer);
    this.arr = new Uint8Array(buffer);
  }

  expand(neededSize: number) {
    const size = this.arr.byteLength;

    if (size >= neededSize) return;

    const newSize = nextPowerOf2(neededSize);
    const newBuffer = new ArrayBuffer(newSize);
    const newArr = new Uint8Array(newBuffer);
    const newDV = new DataView(newBuffer);

    newArr.set(this.arr, 0);

    this.arr = newArr;
    this.dv = newDV;
  }

  writeNumber(type: BNumbType, value: number) {
    this.expand(this.currentOffset + BNumSize[type]);

    if (type === BNumType.u8) this.dv.setUint8(this.currentOffset, value);
    else if (type === BNumType.u16)
      this.dv.setUint16(this.currentOffset, value);
    else if (type === BNumType.u32)
      this.dv.setUint32(this.currentOffset, value);
    else if (type === BNumType.i8) this.dv.setInt8(this.currentOffset, value);
    else if (type === BNumType.i16) this.dv.setInt16(this.currentOffset, value);
    else if (type === BNumType.i32) this.dv.setInt32(this.currentOffset, value);
    else if (type === BNumType.f32)
      this.dv.setFloat32(this.currentOffset, value);
    else if (type === BNumType.f64)
      this.dv.setFloat64(this.currentOffset, value);

    this.currentOffset += BNumSize[type];
  }

  writeBoolean(value: boolean) {
    this.expand(this.currentOffset + 1);

    this.dv.setUint8(this.currentOffset, value ? 1 : 0);

    this.currentOffset += 1;
  }

  writeString(sizeType = BNumType.u8, value: string) {
    const encoded = encoder.encode(value);

    const strSize = encoded.byteLength;
    this.writeNumber(sizeType, strSize);

    this.expand(this.currentOffset + strSize);
    this.arr.set(encoded, this.currentOffset + strSize);

    this.currentOffset += strSize;
  }

  getBuffer() {
    return this.arr.buffer;
  }
}

export class BufferReader {
  private dv: DataView;
  private arr: Uint8Array;
  private currentOffset = 0;

  constructor(buffer: ArrayBuffer) {
    this.dv = new DataView(buffer);
    this.arr = new Uint8Array(buffer);
  }

  reset() {
    this.currentOffset = 0;
  }

  private getReadResult(type: BNumbType, offset: number) {
    if (type === BNumType.u8) return this.dv.getUint8(offset);
    else if (type === BNumType.u16) return this.dv.getUint16(offset);
    else if (type === BNumType.u32) return this.dv.getUint32(offset);
    else if (type === BNumType.i8) return this.dv.getInt8(offset);
    else if (type === BNumType.i16) return this.dv.getInt16(offset);
    else if (type === BNumType.i32) return this.dv.getInt32(offset);
    else if (type === BNumType.f32) return this.dv.getFloat32(offset);
    else if (type === BNumType.f64) return this.dv.getFloat64(offset);

    return 0;
  }

  readNumber(type: BNumbType) {
    const r = this.getReadResult(type, this.currentOffset);

    this.currentOffset += BNumSize[type];

    return r;
  }

  readBoolean() {
    const r = this.dv.getUint8(this.currentOffset);

    this.currentOffset += 1;

    return r > 0;
  }

  readString(sizeType = BNumType.u8) {
    const strSize = this.readNumber(sizeType);

    const result = decoder.decode(
      this.arr.slice(
        this.currentOffset,
        this.currentOffset + (strSize as number)
      )
    );

    this.currentOffset += strSize as number;

    return result;
  }
}
