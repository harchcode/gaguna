const numStrs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const blank = "";

/**
 * A class to render unsigned int text.
 * Sometime we don't want to create too much string, especially if the number text is updated many times per second,
 * as it will create many objects and can trigger GC.
 */
export class UIntText {
  texts: Text[] = [];
  container: HTMLElement;

  constructor(container: HTMLElement, initialLength = 4) {
    this.container = container;

    for (let i = 0; i < initialLength; i++) {
      this.texts.push(this.createText());
    }
  }

  private createText() {
    const text = document.createTextNode(blank);
    this.container.appendChild(text);

    return text;
  }

  set(value: number) {
    const { texts } = this;

    if (value === 0) {
      const text = texts[texts.length - 1];
      text.textContent = numStrs[0];

      return;
    }

    let n = Math.floor(Math.abs(value));
    let i = texts.length - 1;

    while (n) {
      const d = n % 10;

      if (i < 0) {
        const text = this.createText();
        texts.unshift(text);

        text.textContent = numStrs[d];
      } else {
        const text = texts[i];

        text.textContent = numStrs[d];
      }

      n = Math.floor(n / 10);
      i--;
    }

    while (i > 0) {
      i--;

      const text = texts[i];
      text.textContent = blank;
    }
  }
}

export function createUIntText(container: HTMLElement, initialLength = 4) {
  return new UIntText(container, initialLength);
}
