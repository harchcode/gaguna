export function isValidRGBA(color: number) {
  return color >= 0 && color <= 0xffffffff;
}

export function toHexString(color: number) {
  return color.toString(16);
}

export function toRGBAArray(color: number) {
  const r: [number, number, number, number] = [0, 0, 0, 0];
  let n = color;

  for (let i = 3; i >= 0; i--) {
    r[i] = n % 0x100;
    n = ~~(n / 0x100);
  }

  return r;
}

export function toFloat32Array(color: number) {
  const r = new Float32Array(4);
  let n = color;

  for (let i = 3; i >= 0; i--) {
    r[i] = (n % 0x100) / 0xff;
    n = ~~(n / 0x100);
  }

  return r;
}

export function setFloat32Array(out: Float32Array, color: number) {
  let n = color;

  for (let i = 3; i >= 0; i--) {
    out[i] = (n % 0x100) / 0xff;
    n = ~~(n / 0x100);
  }
}

export function setColorArray(
  out: [number, number, number, number],
  color: number
) {
  let n = color;

  for (let i = 3; i >= 0; i--) {
    out[i] = n % 0x100;
    n = ~~(n / 0x100);
  }
}
