/**
 * These are easing functions that will make life easier
 * All functions here expect a number as parameter with range 0 - 1
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @module
 */

const { sin, cos, pow, sqrt, PI } = Math;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

function bounceOut(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    const xd = x - 1.5 / d1;

    return n1 * xd * xd + 0.75;
  } else if (x < 2.5 / d1) {
    const xd = x - 2.25 / d1;

    return n1 * xd * xd + 0.9375;
  } else {
    const xd = x - 2.625 / d1;

    return n1 * xd * xd + 0.984375;
  }
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function linear(x: number) {
  return x;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInQuad(x: number) {
  return x * x;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutQuad(x: number) {
  return 1 - (1 - x) * (1 - x);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutQuad(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInCubic(x: number) {
  return x * x * x;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutCubic(x: number) {
  return 1 - pow(1 - x, 3);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInQuart(x: number) {
  return x * x * x * x;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutQuart(x: number) {
  return 1 - pow(1 - x, 4);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutQuart(x: number) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInQuint(x: number) {
  return x * x * x * x * x;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutQuint(x: number) {
  return 1 - pow(1 - x, 5);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutQuint(x: number) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInSine(x: number) {
  return 1 - cos((x * PI) / 2);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutSine(x: number) {
  return sin((x * PI) / 2);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutSine(x: number) {
  return -(cos(PI * x) - 1) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInExpo(x: number) {
  return x === 0 ? 0 : pow(2, 10 * x - 10);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutExpo(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInCirc(x: number) {
  return 1 - sqrt(1 - pow(x, 2));
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutCirc(x: number) {
  return sqrt(1 - pow(x - 1, 2));
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutCirc(x: number) {
  return x < 0.5
    ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
    : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInBack(x: number) {
  return c3 * x * x * x - c1 * x * x;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutBack(x: number) {
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutBack(x: number) {
  return x < 0.5
    ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInElastic(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutElastic(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutElastic(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInBounce(x: number) {
  return 1 - bounceOut(1 - x);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeOutBounce(x: number) {
  return bounceOut(x);
}

/**
 * Taken from https://easings.net/ https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 *
 * @param x A number indicating progress. Must be a number in the range 0 - 1 for it to work correctly.
 *
 * @category easings
 */
export function easeInOutBounce(x: number) {
  return x < 0.5
    ? (1 - bounceOut(1 - 2 * x)) / 2
    : (1 + bounceOut(2 * x - 1)) / 2;
}
