export function isNullOrUndefined(v: unknown) {
  return v === null || v === undefined;
}

export const formatNumber = (
  amount: number,
  decimalCount = 0,
  decimalSeparator = ".",
  thousandSeparator = ","
): string => {
  const negativeSign = amount < 0 ? "-" : "";
  const amountStr = amount.toFixed(decimalCount).replace("-", "");
  const [intPartStr, decimalPartStr] = amountStr.split(".");
  const thousandCount = intPartStr.length > 3 ? intPartStr.length % 3 : 0;

  return (
    negativeSign +
    (thousandCount
      ? intPartStr.substring(0, thousandCount) + thousandSeparator
      : "") +
    intPartStr
      .substring(thousandCount)
      .replace(/(\d{3})(?=\d)/g, "$1" + thousandSeparator) +
    (decimalPartStr ? `${decimalSeparator}${decimalPartStr}` : "")
  );
};

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function noop() {
  //
}
