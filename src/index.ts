import { wordle } from "./wordle";

wordle();

// function tetration(a: bigint, x: number) {
//   let res: bigint = BigInt(a);
//   for (let i: bigint = BigInt(0); i < x; i++) {
//     res **= BigInt(a);
//   }
//   return res;
// }

// let start = performance.now();

// const res = BigInt(2) ** BigInt(100000000);

// writeFileSync("test.txt", toValuesExt(res));
// console.log(res.toString().length);

// let end = performance.now();

// console.log(millisToHMS(end - start));
