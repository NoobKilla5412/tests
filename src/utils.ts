declare global {
  interface Math {
    lerp(a: number, b: number, alpha: number): number;
  }
}

export function useUtils() {
  if (typeof Math.lerp == "undefined")
    Math.lerp = (a, b, alpha) => {
      return a + alpha * (b - a);
    };
  if (typeof Math.sign == "undefined") Math.sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
  document.write = (text) => document.body.append(text);
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
