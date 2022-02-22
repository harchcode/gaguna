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
  spans: HTMLSpanElement[] = [];
  container: HTMLElement;

  constructor(container: HTMLElement, initialLength = 4) {
    this.container = container;

    for (let i = 0; i < initialLength; i++) {
      this.spans.push(this.createSpan());
    }
  }

  private createSpan() {
    const span = document.createElement("span");
    this.container.appendChild(span);

    return span;
  }

  set(value: number) {
    const { spans } = this;

    if (value === 0) {
      const span = spans[spans.length - 1];
      span.textContent = numStrs[0];

      return;
    }

    let n = Math.floor(Math.abs(value));
    let i = spans.length - 1;

    while (n) {
      const d = n % 10;

      if (i < 0) {
        const span = this.createSpan();
        spans.unshift(span);

        span.textContent = numStrs[d];
      } else {
        const span = spans[i];

        span.textContent = numStrs[d];
      }

      n = Math.floor(n / 10);
      i--;
    }

    while (i > 0) {
      i--;

      const span = spans[i];
      span.textContent = blank;
    }
  }
}

export function createUIntText(container: HTMLElement, initialLength = 4) {
  return new UIntText(container, initialLength);
}
