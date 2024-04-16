function lerp(a, b, alpha) {
  return a + alpha * (b - a);
}

let cap = 45;

let index = Math.round(lerp(0, cap - 1, 0.75));

let res = "";

for (let i = 0; i < cap; i++) {
  if (i == index) res += "X";
  else res += "_";
}

console.log(res);
