/**
 * Simple random number generator with seed, because sometime we need to be able to get the same random number by using the same seed.
 * Taken from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 */

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(ad: number) {
  let a = ad;

  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Random {
  next: () => number;

  constructor(seed = Date.now().toString()) {
    this.next = mulberry32(xmur3(seed)());
  }

  nextFloat(min: number, max: number) {
    return this.next() * (max - min) + min;
  }

  nextInt(min: number, max: number) {
    return ~~(this.next() * (~~max - ~~min + 1) + ~~min);
  }
}

export function createRandom(seed = Date.now().toString()) {
  return new Random(seed);
}
