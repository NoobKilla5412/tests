import { sleep, useUtils } from "./utils";

useUtils();

function calculateProgressBar(percent: number, cap = 100) {
  let index = Math.round(Math.lerp(0, cap - 1, percent));

  let res = "";

  for (let i = 0; i < cap; i++) {
    if (i == index) res += "X";
    else res += ".";
  }

  return res;
}

export async function test() {
  const res = document.body.appendChild(document.createElement("div"));
  for (let i = 0; i <= 1000; i++) {
    res.innerHTML = `${calculateProgressBar(i / 1000)} - ${i / 10}%`;
    await sleep(10);
  }
}
