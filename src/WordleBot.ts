import { log } from "console";
import { readFileSync } from "fs";
import prompt_ from "prompt-sync";
import { roundTo } from "./MathUtils";

const prompt = prompt_({
  sigint: true
});

function wordContainsAllLetters(word: string, letters: string[]) {
  for (const letter of letters) {
    if (!word.includes(letter)) {
      return false;
    }
  }
  return true;
}

function wordContainsOneLetter(word: string, letters: string[]) {
  for (const letter of letters) {
    if (word.indexOf(letter) != word.lastIndexOf(letter)) return false;
  }
  return true;
}

async function waitFor(x: () => Promise<boolean> | boolean) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (x()) {
        clearInterval(interval);
        resolve();
      }
    });
  });
}

interface Options {
  /**
   * @default true
   */
  logging: boolean;
  /**
   * @default true
   */
  useAsync: boolean;
}

const defaultOptions: Options = {
  logging: true,
  useAsync: true
};

export enum Mode {
  Replit = 0b1,
  Github = 0b10,
  Times = 0b100,
  Words = 0b1000,
  All = 0b1111
}

function checkBin(a: number, b: number) {
  return (a & b) > 0;
}

export class WordleBot {
  private mode: Mode;
  private static words: string[];
  private words!: string[];
  private options: Options;

  public constructor(mode: Mode, options: Partial<Options> = defaultOptions) {
    this.mode = mode;
    this.options = Object.assign({}, options, defaultOptions);
    const wordsList = readFileSync("english_wikipedia.csv")
      .toString()
      .split(/\n/)
      .filter((v) => {
        v = v.trim();
        return v.length == 5 && /^[a-zA-Z]+$/i.test(v);
      });
    const replitList = readFileSync("Dictionary-replit.csv").toString().split(/\n/);
    const timesList = readFileSync("Dictionary-wordle-guess.csv").toString().split(/\n/);
    const githubList = readFileSync("Dictionary-github.csv").toString().split(/\n/);
    let words: string[] = [];
    if (checkBin(mode, Mode.Words)) {
      log("Words");
      words = words.concat(wordsList);
    }
    if (checkBin(mode, Mode.Replit)) {
      log("Replit");
      words = words.concat(replitList);
    }
    if (checkBin(mode, Mode.Github)) {
      log("Github");
      words = words.concat(githubList);
    }
    if (checkBin(mode, Mode.Times)) {
      log("Times");
      words = words.concat(timesList);
    }
    WordleBot.words = Array.from(new Set(words)).map((v) => v.toUpperCase().trim());
    log(WordleBot.words.length);
    this.reset();
  }

  // public async getGuess() {
  //   return new Promise<string>(async (resolve) => {
  //     await waitFor(() => this.guessReady);
  //     resolve(this.guess);
  //     this.gotGuess = true;
  //   });
  // }

  // private async getInput() {
  //   return new Promise<string>(async (resolve) => {
  //     let res = await this._getInput();
  //     if (typeof res == "string" && res.length == 5) {
  //       resolve(res);
  //     } else
  //       await waitFor(async () => {
  //         let x = this._getInput();
  //         if (typeof x == "string" && x.length == 5) {
  //           resolve(x);
  //           return true;
  //         }
  //         return false;
  //       });
  //   });
  // }
  public guess!: string;
  public lastWordList = this.words;

  private guessed: string[] = [];
  private withoutLetters = "";
  private singleLetters = "";
  private greenLettersArray: string[] = [];
  private withLetters = Array.from(new Array(5), () => "");
  private withLettersSet = new Set<string>();
  private key = "";
  private i = 0;
  private usedAltStrategyNum = 0;

  public reset() {
    this.words = Array.from(WordleBot.words);
    this.lastWordList = this.words;

    this.guess = "CRANE";
    this.guessed = [];
    this.withoutLetters = "";
    this.singleLetters = "";
    this.greenLettersArray = [];
    this.withLetters = Array.from(new Array(5), () => "");
    this.withLettersSet = new Set<string>();
    this.key = "";
    this.i = 0;
    this.usedAltStrategyNum = 0;
  }

  public async getGuess(getInput: () => Promise<string> | string) {
    this.key = "";
    if (this.words.length == 0) return;
    let input: string;
    while ((input = (await getInput())?.toUpperCase()) == "NEXT") {
      this.words.shift();
      this.guess = this.words[0];
      console.log(`  ${this.guess} - ${this.words.length} - ${roundTo(100 / this.words.length, 0.1)}%`);
    }
    if (input == null) process.exit();
    if (input == "") {
      this.i++;
      return this.guess;
    }
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char == "+") {
        this.withLetters[i] += this.guess[i];
        this.withLettersSet.add(this.guess[i]);
        this.key += `[^${this.withLetters[i]}]`;
      } else if (char == "-") {
        this.key += this.guess[i];
        this.greenLettersArray.push(this.guess[i]);
      } else if (char == "*") {
        let _guess = this.guess.substring(0, i) + this.guess.substring(i + 1);
        let allGrey = true;
        for (let j = 0; j < this.guess.length; j++) {
          if (this.guess[j] == this.guess[i] && input[j] != "*") {
            allGrey = false;
            break;
          }
        }
        if (allGrey || !_guess.includes(this.guess[i])) this.withoutLetters += this.guess[i];
        else if (_guess.includes(this.guess[i])) this.singleLetters += this.guess[i];
        this.key += `[^${this.withLetters[i]}]`;
      }
    }

    let words = this.words.filter(
      (v) =>
        new RegExp(`^${this.key}$`, "i").test(v) &&
        new RegExp(`^[^${this.withoutLetters}]+$`, "i").test(v) &&
        wordContainsOneLetter(v, this.singleLetters.split("")) &&
        wordContainsAllLetters(v, Array.from(this.withLettersSet))
    );

    let usedAltStrategy = false;

    // 98.2% after 1000

    // if (this.usedAltStrategyNum < 2 && words.length > 50) {
    //   words = this.words.filter(
    //     (v) =>
    //       new RegExp(`^[^${this.withoutLetters}]+$`, "i").test(v) &&
    //       new RegExp(`^[^${Array.from(this.withLettersSet).join("")}]+$`, "i").test(v) &&
    //       new RegExp(`^[^${this.greenLettersArray.join("")}]+$`, "i").test(v)
    //     // && !wordContainsAllLetters(v, Array.from(this.withLettersSet))
    //   );
    //   usedAltStrategy = true;
    //   this.usedAltStrategyNum++;
    // }
    let i = 0;
    this.guess = words[/* ~~(Math.random() * words.length) */ i];
    while (i < words.length && this.guessed.includes(this.guess)) {
      i++;
      this.guess = words[i];
    }
    this.lastWordList = words;
    this.guessed.push(this.guess);
    if (!usedAltStrategy) this.words = words;
    this.i++;
    return this.guess?.toUpperCase();
  }
}
