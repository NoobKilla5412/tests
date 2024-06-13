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

const defaultStats: Stats = {
  distributution: [0, 0, 0, 0, 0, 0],
  wins: 0,
  losses: 0,
  games: 0
};

function displayStats(stats: Stats) {
  log(`${stats.games} Played`);
  log(`${roundTo((stats.wins / stats.games) * 100, 0.1)} Win %`);
  for (let i = 0; i < stats.distributution.length; i++) {
    const value = stats.distributution[i];
    log(`${i + 1}: ${generatePercent(value, stats.games)}`);
  }
  log(`7+ ${generatePercent(stats.losses, stats.games)}`);
}

const display = true;
const run = true;
const logOne = false;
const auto = false;

const wordleBot = new WordleBot(Mode.Times);

if (auto) {
  (async () => {
    let stats = readStats();
    if (run) {
      for (let i = 0; logOne ? i < 1 : true; i++) {
        if (i % 250 == 0) writeStats(stats);
        if (display && stats.games > 0 && i % 250 == 0) displayStats(stats);

        let wordle = new Wordle();

        if (logOne) log("Word: " + wordle.word);

        function getInput() {
          let x = wordle.enterAction(guess);
          if (logOne) log("  " + x);
          return x; //prompt({ ask: "> " })?.toUpperCase();
        }

        let guess = (await wordleBot.getGuess(() => "")) || "";

        let count = 1;
        while (!wordle.isSolved(guess) && count < 6) {
          if (logOne) log(`  ${guess} - ${wordleBot.lastWordList.length} - ${roundTo(100 / wordleBot.lastWordList.length, 0.1)}%`);
          let tmp = await wordleBot.getGuess(getInput);
          if (tmp == undefined) {
            break;
          }
          guess = tmp;
          count++;
        }
        if (!wordle.isSolved(guess)) count = 7;
        if (logOne) {
          log(`  ${guess} - ${wordleBot.lastWordList.length} - ${roundTo(100 / wordleBot.lastWordList.length, 0.1)}%`);
        }
        if (count == 7) stats.losses++;
        else stats.wins++;
        if (count != 7) {
          stats.distributution[count - 1]++;
        }
        stats.games++;
        wordleBot.reset();
      }
    } else displayStats(stats);
  })();
} else {
  (async () => {
    function getInput() {
      return prompt({ ask: "> " })?.toUpperCase();
    }

    let guess = wordleBot.guess;

    let count = 1;
    while (true) {
      log(`  ${guess} - ${wordleBot.lastWordList.length} - ${roundTo(100 / wordleBot.lastWordList.length, 0.1)}%`);
      let tmp = await wordleBot.getGuess(getInput);
      if (tmp == undefined) {
        break;
      }
      guess = tmp;
      count++;
    }
    log(`  ${guess} - ${wordleBot.lastWordList.length} - ${roundTo(100 / wordleBot.lastWordList.length, 0.1)}%`);
  })();
}

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
