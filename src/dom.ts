export function scaleDisplayToWindow(
  mainElement: HTMLElement,
  width: number,
  height: number,
  fullWindowElement?: HTMLElement
) {
  const windowAspect = window.innerWidth / window.innerHeight;
  const elementAspect = width / height;

  const scale =
    windowAspect > elementAspect
      ? window.innerHeight / height
      : window.innerWidth / width;

  mainElement.style.width = `${width}px`;
  mainElement.style.height = `${height}px`;
  mainElement.style.transform = `scale(${scale})`;

  if (!fullWindowElement) return;

  fullWindowElement.style.width = `${window.innerWidth / scale}px`;
  fullWindowElement.style.height = `${window.innerHeight / scale}px`;
  fullWindowElement.style.transform = `scale(${scale})`;
}

export function cx(...classNames: (string | false | undefined | null)[]) {
  return classNames.filter(c => c).join(" ");
}

export function cxa(classNames: (string | false | undefined | null)[]) {
  return classNames.filter(c => c).join(" ");
}

export function cxo(classNames: Record<string, boolean | undefined | null>) {
  return Object.keys(classNames)
    .filter(k => classNames[k])
    .join(" ");
}

// Just normal string with html tag, because the lit-html vscode plugin only recognize this tagged string
// and not normal string as html
export function html(strings: TemplateStringsArray, ...values: unknown[]) {
  let str = strings[0];

  for (let i = 0; i < values.length; i++) {
    str += values[i] + strings[i + 1];
  }

  return str;
}
