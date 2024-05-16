import { readFileSync } from "fs";
import prompt_ from "prompt-sync";

const prompt = prompt_();

export async function wordle() {
  let words = readFileSync("dictionary1.csv")
    .toString()
    .split(/\n/)
    .map((v) => v.toUpperCase());
  let withoutLetters = "";
  let withLetters = Array.from(new Array(5), () => "");
  let key = "";
  let guess = "ADIEU";
  let i = 0;
  while (i < 6) {
    console.log(`  ${guess} - ${words.length}`);
    key = "";
    if (words.length <= 0) return;
    const input = prompt({ ask: "> " })?.toUpperCase();
    if (input == null) return;
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char == "+") {
        withLetters[i] += guess[i];
        key += `[^${withLetters[i]}]`;
      } else if (char == guess[i]) {
        key += char;
      } else if (char == "*") {
        withoutLetters += guess[i];
        key += `[^${withLetters[i]}]`;
      }
    }
    words = words.filter(
      (v) =>
        new RegExp(`^${key}$`, "i").test(v) &&
        new RegExp(`^[^${withoutLetters}]+$`, "i").test(v) &&
        new RegExp(`${withLetters.join("").length == 0 ? ".*" : `[${withLetters.join("")}]`}`, "i").test(v)
    );
    guess = words[/* ~~(Math.random() * words.length) */ 0];
    i++;
  }
}
