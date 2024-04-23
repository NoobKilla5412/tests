import { onCondition, sleep, useUtils } from "./utils";

useUtils();

function calculateProgressBar(percent: number, cap = 100) {
  let index = Math.round(Math.lerp(0, cap - 1, percent));

  let res = "";

  for (let i = 0; i < cap; i++) {
    if (i == index) res += "|";
    else res += ".";
  }

  return res;
}

async function run() {
  let inc = 150;

  let winner: number | null = null;

  return new Promise<number | null>(async (resolve) => {
    setImmediate(async () => {
      const res = document.body.appendChild(document.createElement("div"));
      for (let i = 0; i <= inc && winner == null; i += Math.randomRange(0.1, 1)) {
        res.innerHTML = `${calculateProgressBar(i / inc, inc)}`;
        await sleep(10);
      }
      res.innerHTML = "";
      winner ??= 1;
    });
    setImmediate(async () => {
      const res = document.body.appendChild(document.createElement("div"));
      for (let i = 0; i <= inc && winner == null; i += Math.randomRange(0.1, 1)) {
        res.innerHTML = `${calculateProgressBar(i / inc, inc)}`;
        await sleep(10);
      }
      res.innerHTML = "";
      winner ??= 2;
    });
    await onCondition(
      () => winner != null,
      () => {
        resolve(winner || null);
      }
    );
  });
}

export async function test() {
  let runs: (number | null)[] = [];
  for (let i = 0; i < 10; i++) {
    runs.push(await run());
  }
  console.log(runs);
}
