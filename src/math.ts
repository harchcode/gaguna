/**
 * Some are from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * Some are from https://gist.github.com/leodutra/63ca94fe86dcffee1bab
 */

export const MAX_SIGNED_32_BIT_INT = Math.pow(2, 31) - 1;
export const MIN_SIGNED_32_BIT_INT = ~MAX_SIGNED_32_BIT_INT;
export const MAX_U32 = 0b11111111111111111111111111111111;

export function toInt(n: number) {
  return n | 0;
}

export function absInt(n: number) {
  return (n ^ (n >> 31)) - (n >> 31);
}

export function maxInt(a: number, b: number) {
  return a - ((a - b) & ((a - b) >> 31));
}

export function minInt(a: number, b: number) {
  return a - ((a - b) & ((b - a) >> 31));
}

export function clampInt(x: number, min: number, max: number) {
  x = x - ((x - max) & ((max - x) >> 31));

  return x - ((x - min) & ((x - min) >> 31));
}

export function isIntPowerOf2(value: number) {
  return (value & (value - 1)) === 0 && value !== 0;
}

export function isOddInt(n: number) {
  return (n & 1) === 1;
}

export function arraySwapInt(array: number[], i: number, j: number) {
  array[i] ^= array[j];
  array[j] ^= array[i];
  array[i] ^= array[j];
}

export function hasSameSign(a: number, b: number) {
  return (a ^ b) >= 0;
}

export function intPowOf2(n: number) {
  return 2 << (n - 1);
}

export function modInt(numerator: number, divisor: number) {
  // divisor must be a power of 2
  return numerator & (divisor - 1);
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number) {
  min |= 0;
  max |= 0;

  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function getRandomIntInclusive(min: number, max: number) {
  min |= 0;
  max |= 0;

  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export function nextPowerOf2(value: number): number {
  if (value <= 0) return 1;

  let result = value;

  result--;
  result |= result >> 1;
  result |= result >> 2;
  result |= result >> 4;
  result |= result >> 8;
  result |= result >> 16;
  result++;

  return result;
}

export function getIntDigitCount(n: number): number {
  n = absInt(n);

  if (n === 0) return 1;

  let r = 0;

  while (n > 0) {
    r++;
    n = Math.floor(n / 10);
  }

  return r;
}

export function setBit(n: number, index: number) {
  return n | (1 << index);
}

export function clearBit(n: number, index: number) {
  return n & ~(1 << index);
}

export function flipBit(n: number, index: number) {
  return n ^ (1 << index);
}

export function flipAllBits(n: number) {
  return n ^ MAX_U32;
}

export function testBit(n: number, index: number) {
  return (n & (1 << index)) > 0;
}

export function isAnyBitSet(n: number) {
  return n > 0;
}

export function isNoBitSet(n: number) {
  return n === 0;
}

export function countSetBit(n: number) {
  let r = 0;

  while (n) {
    r += n & 1;
    n >>= 1;
  }

  return r;
}
