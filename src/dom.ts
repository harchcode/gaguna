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

  mainElement.style.width = `${width * scale}px`;
  mainElement.style.height = `${width * scale}px`;

  if (!fullWindowElement) return;

  fullWindowElement.style.width = `${window.innerWidth / scale}px`;
  fullWindowElement.style.height = `${window.innerHeight / scale}px`;
  fullWindowElement.style.transformOrigin = "0 0";
  fullWindowElement.style.transform = `scale(${scale})`;
}
