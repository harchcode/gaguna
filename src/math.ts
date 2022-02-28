// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number) {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt) + minInt); //The maximum is exclusive and the minimum is inclusive
}

export function getRandomIntInclusive(min: number, max: number) {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt); //The maximum is inclusive and the minimum is inclusive
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

export function pow2(value: number): number {
  return (2 << (value - 1)) - 1;
}

export function getIntDigitCount(value: number): number {
  if (value === 0) return 1;

  let n = Math.floor(Math.abs(value));
  let r = 0;

  while (n > 0) {
    r++;
    n = Math.floor(n / 10);
  }

  return r;
}
