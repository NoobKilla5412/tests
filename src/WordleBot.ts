import { readFileSync } from "fs";
import prompt_ from "prompt-sync";

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

function roundTo(x: number, a: number) {
  a = 1 / a;
  return Math.round(x * a) / a;
}

async function waitFor(x: () => Promise<boolean> | boolean, cb?: () => void) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (x()) {
        clearInterval(interval);
        if (cb) cb();
        resolve();
      }
    });
  });
}

export class WordleBot {
  private mode: Mode;
  private words!: string[];
  private gotGuess = false;
  private logging = true;
  private useAsync = true;
  private _getInput: () => Promise<string> | string;

  private guess = "ADIEU";
  public guessReady = true;

  public constructor(mode: Mode, getInput?: () => Promise<string> | string, useAsync = true, logging = true) {
    this.mode = mode;
    this.useAsync = useAsync;
    this.logging = logging;
    if (getInput) this._getInput = getInput;
    else this._getInput = () => prompt({ ask: "> " })?.toUpperCase();
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
  }

  public async getGuess() {
    return new Promise<string>(async (resolve) => {
      await waitFor(() => this.guessReady);
      resolve(this.guess);
      this.gotGuess = true;
    });
  }

  private async getInput() {
    return new Promise<string>(async (resolve) => {
      let res = await this._getInput();
      if (typeof res == "string" && res.length == 5) {
        resolve(res);
      } else
        await waitFor(
          async () => {
            let x = this._getInput();
            return typeof x == "string" && x.length == 5;
          },
          () => {
            let x = this._getInput();
            resolve(x);
          }
        );
    });
  }

  public async wordle() {
    let guessed: string[] = [];
    let withoutLetters = "";
    let singleLetters = "";
    let withLetters = Array.from(new Array(5), () => "");
    let withLettersSet = new Set<string>();
    let key = "";
    let i = 0;
    while (i < 6) {
      if (this.logging) console.log(`  ${this.guess} - ${this.words.length} - ${roundTo(100 / this.words.length, 0.1)}%`);
      key = "";
      if (this.words.length <= 0) return;
      let input: string;
      while ((input = (await this.getInput())?.toUpperCase()) == "NEXT") {
        this.words.shift();
        this.guess = this.words[0];
        console.log(`  ${this.guess} - ${this.words.length} - ${roundTo(100 / this.words.length, 0.1)}%`);
      }
      if (input == null) return;
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char == "+") {
          withLetters[i] += this.guess[i];
          withLettersSet.add(this.guess[i]);
          key += `[^${withLetters[i]}]`;
        } else if (char == "-") {
          key += this.guess[i];
        } else if (char == "*") {
          let _guess = this.guess.substring(0, i) + this.guess.substring(i + 1);
          let allGrey = true;
          for (let j = 0; j < this.guess.length; j++) {
            if (this.guess[j] == this.guess[i] && input[j] != "*") {
              allGrey = false;
              break;
            }
          }
          if (allGrey || !_guess.includes(this.guess[i])) withoutLetters += this.guess[i];
          else if (_guess.includes(this.guess[i])) singleLetters += this.guess[i];
          key += `[^${withLetters[i]}]`;
        }
      }
      this.words = this.words.filter(
        (v) =>
          new RegExp(`^${key}$`, "i").test(v) &&
          new RegExp(`^[^${withoutLetters}]+$`, "i").test(v) &&
          wordContainsOneLetter(v, singleLetters.split("")) &&
          wordContainsAllLetters(v, Array.from(withLettersSet))
      );
      i = 0;
      this.guess = this.words[/* ~~(Math.random() * words.length) */ i];
      while (guessed.includes(this.guess)) {
        i++;
        this.guess = this.words[i];
      }

      guessed.push(this.guess);
      this.guessReady = true;
      if (this.useAsync) {
        await waitFor(() => this.gotGuess);
        this.gotGuess = false;
        this.guessReady = false;
      }
      i++;
    }
  }
}
