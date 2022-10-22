/* Can only support RGB because integer in JS when applied with "|" operator, result in 32 bit integer,
   and 0xffffffff is more than max value of 32 bit integer.
*/

export function isValidRGB(color: number) {
  return color >= 0 && color <= 0xffffff;
}

export function toHexString(color: number) {
  return color.toString(16);
}

export function toArray(rgb: number, opacity = 255) {
  rgb |= 0;

  const r: [number, number, number, number] = [0, 0, 0, opacity];

  for (let i = 2; i >= 0; i--) {
    r[i] = rgb % 0x100;
    rgb = (rgb / 0x100) | 0;
  }

  return r;
}

export function toFloat32Array(rgb: number, opacity = 1) {
  rgb |= 0;

  const r = new Float32Array(4);
  r[3] = opacity;

  for (let i = 2; i >= 0; i--) {
    r[i] = (rgb % 0x100) / 0xff;
    rgb = (rgb / 0x100) | 0;
  }

  return r;
}

export function setFloat32Array(out: Float32Array, rgb: number, opacity = 1) {
  rgb |= 0;

  out[3] = opacity;

  for (let i = 2; i >= 0; i--) {
    out[i] = (rgb % 0x100) / 0xff;
    rgb = (rgb / 0x100) | 0;
  }
}

export function setArray(
  out: [number, number, number, number],
  rgb: number,
  opacity = 255
) {
  rgb |= 0;

  out[3] = opacity;

  for (let i = 3; i >= 0; i--) {
    out[i] = rgb % 0x100;
    rgb = (rgb / 0x100) | 0;
  }
}
