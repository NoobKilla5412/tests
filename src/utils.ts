declare global {
  interface Math {
    lerp(a: number, b: number, alpha: number): number;
    randomRange(min: number, max: number): number;
  }
}

export function useUtils() {
  if (typeof Math.lerp == "undefined")
    Math.lerp = (a, b, alpha) => {
      return a + alpha * (b - a);
    };
  if (typeof Math.sign == "undefined") Math.sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

  if (typeof Math.randomRange == "undefined") Math.randomRange = (min, max) => Math.random() * (max - min) + min;

  document.write = (text) => document.body.append(text);

  if (typeof setImmediate == "undefined")
    //@ts-ignore
    global.setImmediate = (cb) => {
      setTimeout(cb, 0);
    };
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function onCondition(condition: () => boolean, cb: () => void) {
  return new Promise<void>((resolve) => {
    if (condition()) {
      cb();
      resolve();
    } else {
      const id = setInterval(() => {
        if (condition()) {
          cb();
          clearInterval(id);
          resolve();
        }
      });
    }
  });
}
