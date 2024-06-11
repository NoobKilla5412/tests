import { log } from "console";
import { readFileSync, writeFileSync } from "fs";
import prompt_ from "prompt-sync";
import { ceilTo, floorTo, roundTo } from "./MathUtils";
import { Wordle } from "./Wordle";
import { Mode, WordleBot } from "./WordleBot";

const prompt = prompt_();

interface Stats {
  distributution: [number, number, number, number, number, number];
  wins: number;
  losses: number;
  games: number;
}

function readJSON(fileName: string) {
  return JSON.parse(readFileSync(fileName).toString());
}

function writeJSON(fileName: string, data: any) {
  writeFileSync(fileName, JSON.stringify(data, null, 2));
}

function readStats(): Stats {
  return readJSON("stats.json");
}

function writeStats(stats: Stats) {
  writeJSON("stats.json", stats);
}

function generatePercent(a: number, b: number) {
  return `${(roundTo((a / b) * 100, 0.01) + "%").padEnd(6, " ")} ${"=".repeat(floorTo(100 * (a / b)))}${"-".repeat(ceilTo(100 * (1 - a / b)))} ${a}`;
}

function displayStats(stats: Stats) {
  log(`${stats.games} Played`);
  log(`${roundTo((stats.wins / stats.games) * 100, 0.1)} Win %`);
  for (let i = 0; i < stats.distributution.length; i++) {
    const value = stats.distributution[i];
    log(`${i + 1}: ${generatePercent(value, stats.games)}`);
  }
}

const display = true;
const run = true;

(async () => {
  let stats = readStats();
  if (run)
    for (let i = 0; ; i++) {
      if (i % 250 == 0) writeStats(stats);
      if (display && i % 1000 == 0) displayStats(stats);

      let wordle = new Wordle();

      function getInput() {
        return wordle.enterAction(guess); //prompt({ ask: "> " })?.toUpperCase();
      }

      const wordleBot = new WordleBot(Mode.Both);

      let guess = wordleBot.guess;

      let count = 1;
      while (!wordle.isSolved(guess) && count < 6) {
        // log(`  ${guess} - ${wordleBot.words.length} - ${roundTo(100 / wordleBot.words.length, 0.1)}%`);
        let tmp = await wordleBot.getGuess(getInput);
        if (tmp == undefined) {
          break;
        }
        guess = tmp;
        // log("guess", guess);
        count++;
      }
      if (!wordle.isSolved(guess)) count = 7;
      // log(`  ${guess} - ${wordleBot.words.length} - ${roundTo(100 / wordleBot.words.length, 0.1)}%`);
      // log(i);
      if (count == 7) stats.losses++;
      else stats.wins++;
      if (count != 7) {
        stats.distributution[count - 1]++;
      }
      stats.games++;
    }
  else displayStats(stats);
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
