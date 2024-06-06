import { log } from "console";
import { Wordle } from "./Wordle";
import { Mode, WordleBot } from "./WordleBot";

(async () => {
  let input = "";
  let wordle = new Wordle();

  const wordleBot = new WordleBot(Mode.Both, () => input, true, false);

  wordleBot.wordle();

  let guess = await wordleBot.getGuess();
  log("guess", guess);

  let i = 1;
  while (!wordle.isSolved(guess) && i < 6) {
    input = wordle.enterAction(guess);
    log("input", input);
    guess = await wordleBot.getGuess();
    log("guess", guess);
    i++;
  }
  if (!wordle.isSolved(guess)) i = 7;
  log(i);
})();

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
