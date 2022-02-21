import { createPool, Pool } from ".";

const numStrs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const blank = "";

/**
 * A class to render unsigned int text.
 * Sometime we don't want to create too much string, especially if the number text is updated many times per second,
 * as it will create many objects and can trigger GC.
 *
 * This class only adds spans element inside the container class, so you can style them anyway you want.
 */
export class UIntText {
  spans: Pool<HTMLSpanElement>;

  constructor(container: HTMLElement, initialLength = 4) {
    this.spans = createPool<HTMLSpanElement>(() => {
      const span = document.createElement("span");
      container.appendChild(span);

      return span;
    }, initialLength);
  }

  private clearSpan(span: HTMLSpanElement) {
    span.textContent = blank;
  }

  set(value: number) {
    const { spans } = this;

    spans.getAll().forEach(this.clearSpan);
    spans.clear();

    if (value === 0) {
      const span = spans.obtain();
      span.textContent = numStrs[0];

      return;
    }

    let n = Math.floor(Math.abs(value));

    while (n) {
      const d = n % 10;

      const span = spans.obtain();
      span.textContent = numStrs[d];

      n = Math.floor(n / 10);
    }
  }
}

export function createUIntText(container: HTMLElement, initialLength = 4) {
  return new UIntText(container, initialLength);
}
