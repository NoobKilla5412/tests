// const str = "W";
// const str = "𒐫";
const str = "﷽";
// const str = "@all ";
// const str = "🔥";
// const str = "Hello ";

const maxLen = 4096;

let text: string;

export function getMaxLen() {
  if (text) return text;
  return (text = str.repeat(maxLen / str.length));
}

export function writeMaxLen() {
  document.body.append(getMaxLen());
}
