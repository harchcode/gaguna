// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedFn<F extends (...args: any[]) => any> = {
  (...args: Parameters<F>): Promise<ReturnType<F>>;
  cancel: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  ms = 300
): DebouncedFn<F> {
  let timer: NodeJS.Timeout;

  const debouncedFunc: DebouncedFn<F> = (...args) =>
    new Promise(resolve => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  debouncedFunc.cancel = () => clearTimeout(timer);

  return debouncedFunc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedLeadingFn<F extends (...args: any[]) => any> = {
  (...args: Parameters<F>): ReturnType<F>;
  cancel: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceLeading<F extends (...args: any[]) => any>(
  fn: F,
  ms = 300
): DebouncedLeadingFn<F> {
  let timer: NodeJS.Timeout | undefined = undefined;
  let prev: ReturnType<F>;

  const debouncedFunc: DebouncedLeadingFn<F> = (...args) => {
    if (!timer) {
      prev = fn(args);
      return prev;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = undefined;
    }, ms);

    return prev;
  };

  debouncedFunc.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debouncedFunc;
}
