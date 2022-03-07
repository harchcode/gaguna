import { linear } from "./easings";

// For quick, simple to use tween
export function tween(
  from: number,
  to: number,
  duration: number,
  onUpdate: (current: number) => void,
  easingFn = linear
): Promise<void> {
  return new Promise(resolve => {
    const change = to - from;
    const startTime = Date.now();

    let elapsed = 0;
    let currentValue = from;

    const raf = requestAnimationFrame || setTimeout;

    const animate = () => {
      elapsed = Date.now() - startTime;

      currentValue = from + easingFn(elapsed / duration) * change;
      onUpdate(currentValue);

      if (elapsed < duration) {
        raf(animate);
      } else {
        resolve();
      }
    };

    animate();
  });
}

// For creating tween object that can be updated anytime we want
export function createTween(
  from: number,
  to: number,
  duration: number,
  easingFn = linear
) {
  const change = to - from;
  let elapsed = 0;

  return {
    update: (dt: number) => {
      elapsed += dt;

      return from + easingFn(elapsed / duration) * change;
    },
    getValueByElapsedTime: (elapsed: number) => {
      return from + easingFn(elapsed / duration) * change;
    }
  };
}
