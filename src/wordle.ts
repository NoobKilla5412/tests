import { log } from "console";
import { readFileSync } from "fs";

export class Wordle {
  word: string;
  amountOfLetters: Map<string, number> = new Map();

  public constructor() {
    let words = readFileSync("Dictionary-github.csv").toString().split(/\n/);
    this.word = words[~~(Math.random() * words.length)].toUpperCase();
    this.word = "TUNAS";
    log(this.word);
    for (let i = 0; i < this.word.length; i++) {
      let current = this.amountOfLetters.get(this.word.charAt(i));
      if (current == null) {
        current = 0;
      }
      this.amountOfLetters.set(this.word.charAt(i), current + 1);
    }
  }

  public isSolved(s: string) {
    return s == this.word;
  }

  public enterAction(s: string) {
    let usedLetters: Map<string, number> = new Map();
    for (const [letter, amount] of this.amountOfLetters) {
      usedLetters.set(letter, amount);
    }

    let res: string[] = new Array(5);
    for (let i = 0; i < s.length; i++) {
      let ch = s.charAt(i);
      if (this.word.charAt(i) == ch) {
        res[i] = "-";
        usedLetters.set(ch, (usedLetters.get(ch) || 0) - 1);
      }
    }
    for (let i = 0; i < s.length; i++) {
      let ch = s.charAt(i);
      if (this.word.includes(ch) && res[i] != "-") {
        if ((usedLetters.get(ch) || 0) > 0) {
          res[i] = "+";
          usedLetters.set(ch, (usedLetters.get(ch) || 0) - 1);
        } else res[i] = "*";
      } else if (!this.word.includes(ch)) {
        res[i] = "*";
      }
    }
    return res.join("");
  }
}
