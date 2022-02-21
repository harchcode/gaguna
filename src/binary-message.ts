import { nextPowerOf2 } from "./math";

export type BValue = number | boolean | string;
export type BValueParam = BValue | BValueArray | BValueObject;
export type BValueArray = BValueParam[];
export type BValueObject = null | {
  [x: string]: BValueParam;
};

export type BTypeFunc = () => BType | BTypeArray | BTypeObject;
export type BTypeParam = BType | BTypeArray | BTypeObject | BTypeFunc;
export type BTypeArray = BTypeParam[];
export type BTypeObject = {
  [x: string]: BTypeParam;
};

export const BType = {
  u8: "u8",
  u16: "u16",
  u32: "u32",
  i8: "i8",
  i16: "i16",
  i32: "i32",
  f32: "f32",
  f64: "f64",
  bool: "bool",
  str: "str"
} as const;
export type BType = typeof BType[keyof typeof BType];

export const BSIZE = {
  u8: 1,
  u16: 2,
  u32: 4,
  i8: 1,
  i16: 2,
  i32: 4,
  f32: 4,
  f64: 8,
  bool: 1,
  str: 0
};

const INITIAL_BUFFER_SIZE = 128;
const BITS_PER_BYTE = 8;
const SIZE_COUNT_BIT = 3;
const BYTE_1_WITH_SIZE_REST = BITS_PER_BYTE - SIZE_COUNT_BIT;
const BYTE_2_WITH_SIZE_REST = BITS_PER_BYTE * 2 - SIZE_COUNT_BIT;
const BYTE_4_WITH_SIZE_REST = BITS_PER_BYTE * 4 - SIZE_COUNT_BIT;
const BYTE_1_WITH_SIZE_LIMIT = 1 << BYTE_1_WITH_SIZE_REST;
const BYTE_2_WITH_SIZE_LIMIT = 1 << BYTE_2_WITH_SIZE_REST;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class BBuffer {
  private arr: Uint8Array;
  private dv: DataView;

  private constructor(arrayBuffer: ArrayBuffer) {
    this.arr = new Uint8Array(arrayBuffer);
    this.dv = new DataView(arrayBuffer);
  }

  static create = (size: number) => {
    const arrayBuffer = new ArrayBuffer(size);

    return new BBuffer(arrayBuffer);
  };

  static from = (arrayBuffer: ArrayBuffer) => {
    return new BBuffer(arrayBuffer);
  };

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

  writeSize(offset: number, size: number) {
    if (size < BYTE_1_WITH_SIZE_LIMIT) {
      const writeVal = (1 << BYTE_1_WITH_SIZE_REST) | size;
      return this.write(BType.u8, offset, writeVal);
    }

    if (size < BYTE_2_WITH_SIZE_LIMIT) {
      const writeVal = (2 << BYTE_2_WITH_SIZE_REST) | size;
      return this.write(BType.u16, offset, writeVal);
    }

    const writeVal = (4 << BYTE_4_WITH_SIZE_REST) | size;
    return this.write(BType.u32, offset, writeVal);
  }

  readSize(offset: number): [number, number] {
    const [firstByteValue] = this.read(BType.u8, offset);
    const byteSize = (firstByteValue as number) >> BYTE_1_WITH_SIZE_REST;

    const type =
      byteSize === 1 ? BType.u8 : byteSize === 2 ? BType.u16 : BType.u32;

    const [readVal, size] = this.read(type, offset);
    const value =
      (readVal as number) &
      ((1 << (byteSize * BITS_PER_BYTE - SIZE_COUNT_BIT)) - 1);

    return [value, size];
  }

  write = (type: BType, offset: number, value: BValue): number => {
    if (type !== BType.str) {
      this.expand(offset + BSIZE[type]);

      if (type === BType.u8) this.dv.setUint8(offset, value as number);
      else if (type === BType.u16) this.dv.setUint16(offset, value as number);
      else if (type === BType.u32) this.dv.setUint32(offset, value as number);
      else if (type === BType.i8) this.dv.setInt8(offset, value as number);
      else if (type === BType.i16) this.dv.setInt16(offset, value as number);
      else if (type === BType.i32) this.dv.setInt32(offset, value as number);
      else if (type === BType.f32) this.dv.setFloat32(offset, value as number);
      else if (type === BType.f64) this.dv.setFloat64(offset, value as number);
      else if (type === BType.bool) this.dv.setUint8(offset, value ? 1 : 0);

      return BSIZE[type];
    } else {
      const encoded = encoder.encode(value as string);

      const valueSize = encoded.byteLength;
      const typeSize = this.writeSize(offset, valueSize);

      this.expand(offset + valueSize + typeSize);
      this.arr.set(encoded, offset + typeSize);

      return typeSize + valueSize;
    }
  };

  private getReadResult(type: BType, offset: number) {
    if (type === BType.u8) return this.dv.getUint8(offset);
    else if (type === BType.u16) return this.dv.getUint16(offset);
    else if (type === BType.u32) return this.dv.getUint32(offset);
    else if (type === BType.i8) return this.dv.getInt8(offset);
    else if (type === BType.i16) return this.dv.getInt16(offset);
    else if (type === BType.i32) return this.dv.getInt32(offset);
    else if (type === BType.f32) return this.dv.getFloat32(offset);
    else if (type === BType.f64) return this.dv.getFloat64(offset);
    else if (type === BType.bool) return this.dv.getUint8(offset);

    return 0;
  }

  read(type: BType, offset: number): [BValue, number] {
    if (type !== BType.str) {
      const res = this.getReadResult(type, offset);

      return [type === BType.bool ? res > 0 : res, BSIZE[type]];
    } else {
      const [valueSize, typeSize] = this.readSize(offset);
      const dataOffset = offset + typeSize;

      const result = decoder.decode(
        this.arr.slice(dataOffset, dataOffset + (valueSize as number))
      );

      return [result, typeSize + (valueSize as number)];
    }
  }

  toArrayBuffer(): ArrayBuffer {
    return this.arr.buffer;
  }
}

function serializeArray(
  buffer: BBuffer,
  value: BValueArray,
  type: BTypeArray,
  offset = 0
): number {
  let currentOffset = offset;

  currentOffset += buffer.writeSize(currentOffset, value.length);

  value.forEach(v => {
    currentOffset += serializeValue(buffer, v, type[0], currentOffset);
  });

  return currentOffset - offset;
}

function serializeObject(
  buffer: BBuffer,
  value: BValueObject,
  type: BTypeObject,
  offset = 0
): number {
  let currentOffset = offset;
  const keys = Object.keys(type);

  const typeSize = buffer.writeSize(currentOffset, value ? keys.length : 0);

  if (!value) return typeSize;

  currentOffset += typeSize;

  keys.forEach(k => {
    currentOffset += serializeValue(buffer, value[k], type[k], currentOffset);
  });

  return currentOffset - offset;
}

function serializeValue(
  buffer: BBuffer,
  value: BValueParam,
  type: BTypeParam,
  offset = 0
): number {
  if (!(typeof type === "object")) {
    return buffer.write(type as BType, offset, value as BValue);
  }

  if (type.constructor === Array) {
    return serializeArray(
      buffer,
      value as BValueArray,
      type as BTypeArray,
      offset
    );
  }

  return serializeObject(
    buffer,
    value as BValueObject,
    type as BTypeObject,
    offset
  );
}

export function serialize(value: BValueParam, type: BTypeParam) {
  const buffer = BBuffer.create(INITIAL_BUFFER_SIZE);
  const size = serializeValue(buffer, value, type);

  return buffer.toArrayBuffer().slice(0, size);
}

function deserializeArray(
  buffer: BBuffer,
  type: BTypeArray,
  offset = 0
): [BValueArray, number] {
  let currentOffset = offset;

  const [size, typeSize] = buffer.readSize(currentOffset);
  currentOffset += typeSize;

  const result = [];

  for (let i = 0; i < size; i++) {
    const [value, valueSize] = deserializeValue(buffer, type[0], currentOffset);

    result.push(value);
    currentOffset += valueSize;
  }

  return [result, currentOffset - offset];
}

function deserializeObject(
  buffer: BBuffer,
  type: BTypeObject,
  offset = 0
): [BValueObject, number] {
  let currentOffset = offset;

  const [size, typeSize] = buffer.readSize(currentOffset);

  if (size === 0) return [null, typeSize];

  currentOffset += typeSize;

  const result = Object.create(null);

  Object.keys(type).forEach(k => {
    const [value, valueSize] = deserializeValue(buffer, type[k], currentOffset);

    result[k] = value;
    currentOffset += valueSize;
  });

  return [result, currentOffset - offset];
}

function deserializeValue(
  buffer: BBuffer,
  type: BTypeParam,
  offset = 0
): [BValueParam, number] {
  if (!(typeof type === "object")) {
    return buffer.read(type as BType, offset);
  }

  if (type.constructor === Array) {
    return deserializeArray(buffer, type as BTypeArray, offset);
  }

  return deserializeObject(buffer, type as BTypeObject, offset);
}

export function deserialize(arrayBuffer: ArrayBuffer, type: BTypeParam) {
  const buffer = BBuffer.from(arrayBuffer);

  return deserializeValue(buffer, type)[0];
}
