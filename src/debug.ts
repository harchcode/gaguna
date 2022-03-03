export function uint8ArrayToBinaryString(arr: Uint8Array, separator = "-") {
  const r: string[] = [];

  arr.forEach(x => {
    r.push(x.toString(2).padStart(8, "0"));
  });

  return r.join(separator);
}
