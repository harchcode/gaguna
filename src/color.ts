export function isValidRGBA(color: number) {
  return color >= 0 && color <= 0xffffffff;
}

export function toHexString(color: number) {
  return color.toString(16);
}

export function toRGBAArray(color: number) {
  color |= 0;

  const r: [number, number, number, number] = [0, 0, 0, 0];

  for (let i = 3; i >= 0; i--) {
    r[i] = color % 0x100;
    color = color / 0x100;
  }

  return r;
}

export function toFloat32Array(color: number) {
  color |= 0;

  const r = new Float32Array(4);

  for (let i = 3; i >= 0; i--) {
    r[i] = (color % 0x100) / 0xff;
    color = color / 0x100;
  }

  return r;
}

export function setFloat32Array(out: Float32Array, color: number) {
  color |= 0;

  for (let i = 3; i >= 0; i--) {
    out[i] = (color % 0x100) / 0xff;
    color = color / 0x100;
  }
}

export function setColorArray(
  out: [number, number, number, number],
  color: number
) {
  color |= 0;

  for (let i = 3; i >= 0; i--) {
    out[i] = color % 0x100;
    color = color / 0x100;
  }
}
