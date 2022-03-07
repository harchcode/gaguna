const FPS = 60;
const MPF = 1000 / FPS;
const SPF = MPF * 0.001;
const raf = requestAnimationFrame || setTimeout;

export class GameLoop {
  private startTime = 0;
  private lastTime = 0;

  private counter = 0;
  private updateFn: (dt: number) => void;
  private drawFn?: () => void;

  constructor(updater: (dt: number) => void, drawer?: () => void) {
    this.updateFn = updater;
    this.drawFn = drawer;
  }

  start = () => {
    this.startTime = Date.now();
    this.lastTime = this.startTime;

    raf(this.run);
  };

  private run = () => {
    const current = Date.now();
    const dt = current - this.lastTime;

    this.counter += dt;
    this.lastTime = current;

    while (this.counter > MPF) {
      this.updateFn(SPF);

      this.counter -= MPF;
    }

    this.drawFn?.();

    raf(this.run);
  };
}
