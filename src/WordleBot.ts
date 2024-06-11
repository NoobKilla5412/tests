import { log } from "console";
import { readFileSync } from "fs";
import prompt_ from "prompt-sync";
import { roundTo } from "./MathUtils";

const prompt = prompt_();

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

export enum Mode {
  Replit,
  Github,
  Both
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

export class WordleBot {
  private mode: Mode;
  public words!: string[];
  private options: Options;

  public guess = "ADIEU";

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
    const githubList = readFileSync("Dictionary-github.csv").toString().split(/\n/);
    switch (this.mode) {
      case Mode.Replit:
        this.words = replitList;
        break;
      case Mode.Github:
        this.words = githubList;
        break;
      case Mode.Both:
        this.words = replitList.concat(githubList);
        break;
    }
    this.words = Array.from(new Set(wordsList.concat(this.words.map((v) => v.toUpperCase()))));
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
  private guessed: string[] = [];
  private withoutLetters = "";
  private singleLetters = "";
  private withLetters = Array.from(new Array(5), () => "");
  private withLettersSet = new Set<string>();
  private key = "";
  private i = 0;

  public reset() {
    this.guessed = [];
    this.withoutLetters = "";
    this.singleLetters = "";
    this.withLetters = Array.from(new Array(5), () => "");
    this.withLettersSet = new Set<string>();
    this.key = "";
    this.i = 0;
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
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char == "+") {
        this.withLetters[i] += this.guess[i];
        this.withLettersSet.add(this.guess[i]);
        this.key += `[^${this.withLetters[i]}]`;
      } else if (char == "-") {
        this.key += this.guess[i];
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
    this.words = this.words.filter(
      (v) =>
        new RegExp(`^${this.key}$`, "i").test(v) &&
        new RegExp(`^[^${this.withoutLetters}]+$`, "i").test(v) &&
        wordContainsOneLetter(v, this.singleLetters.split("")) &&
        wordContainsAllLetters(v, Array.from(this.withLettersSet))
    );
    this.i = 0;
    this.guess = this.words[/* ~~(Math.random() * words.length) */ this.i];
    while (this.guessed.includes(this.guess)) {
      this.i++;
      this.guess = this.words[this.i];
    }

    this.guessed.push(this.guess);
    this.i++;
    return this.guess;
  }
}
