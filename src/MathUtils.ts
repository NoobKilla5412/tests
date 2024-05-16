function getValue(exp: number) {
  let string = "1" + "0".repeat(exp);
  return BigInt(string);
}

const values = [
  {
    key: getValue(3),
    value: "K",
    ext: "Thousand"
  },
  {
    key: getValue(6),
    value: "M",
    ext: "Million"
  },
  {
    key: getValue(9),
    value: "B",
    ext: "Billion"
  },
  {
    key: getValue(12),
    value: "T",
    ext: "Trillion"
  },
  {
    key: getValue(15),
    value: "q",
    ext: "Quadrillion"
  },
  {
    key: getValue(18),
    value: "Q",
    ext: "Quintillion"
  },
  {
    key: getValue(21),
    value: "s",
    ext: "Sextillion"
  },
  {
    key: getValue(24),
    value: "S",
    ext: "Septillion"
  }
];

// writeLn(BigInt(values[7].key));

export function roundTo(x: number, to: number = 1) {
  let rec = 1 / to;
  return Math.round(+x.toString() * rec) / rec;
}

export function floorTo(x: number, to: number = 1) {
  let rec = 1 / to;
  return Math.floor(x * rec) / rec;
}

export function ceilTo(x: number, to: number = 1) {
  let rec = 1 / to;
  return Math.ceil(x * rec) / rec;
}

export function toValues(x: bigint | number) {
  for (let i = values.length - 1; i >= 0; i--) {
    const element = values[i];
    if (x >= element.key) {
      return fancyNumber(roundTo(Number(BigInt(x) / element.key), 0.01)) + element.value;
    }
  }
  return fancyNumber(<any>x instanceof Number ? roundTo(Number(x), 0.01) : x);
}

/**
 * @param {string} x
 */
export function fromValues(x: string) {
  for (let i = values.length - 1; i >= 0; i--) {
    const element = values[i];
    if (x.endsWith(element.value)) {
      return BigInt(~~x.replace(/[^\d.]/g, "")) * element.key;
    }
  }
  return BigInt(~~+x);
}

/**
 * @param {bigint} x
 */
export function toValuesExt(x: bigint | number) {
  for (let i = values.length - 1; i >= 0; i--) {
    const element = values[i];
    if (x >= element.key) {
      return fancyNumber(BigInt(x) / element.key) + " " + element.ext;
    }
  }
  return fancyNumber(<any>x instanceof Number ? roundTo(Number(x), 0.01) : x);
}

export function OoM_Ext(x: number) {
  for (let i = values.length - 1; i >= 0; i--) {
    const element = values[i];
    if (x >= element.key) {
      return element.ext;
    }
  }
  return "";
}

export function OoM(x: number) {
  for (let i = values.length - 1; i >= 0; i--) {
    const element = values[i];
    if (BigInt(x) >= element.key) {
      return element.value;
    }
  }
  return "";
}

export function fromValuesExt(x: string) {
  for (let i = values.length - 1; i >= 0; i--) {
    const element = values[i];
    if (x.endsWith(element.ext)) {
      return +x.replace(/[^\d.]/g, "") * +element.key.toString();
    }
  }
  return +x;
}

export function fancyNumber(x: bigint | number) {
  let rem = +x.toString() % 1;
  if (x == Infinity) return x.toString();
  let string = BigInt(x).toString();
  let res = "";
  let count = 0;
  for (let i = string.length - 1; i >= 0; i--) {
    const element = string[i];
    res += element;
    if (count == 2 && i != 0) {
      res += ",";
      count = 0;
    } else count++;
  }

  return res.split("").reverse().join("") + (rem ? roundTo(rem, 0.0001).toString().slice(1) : "");
}

export function unFancyNumber(x: string) {
  return +x.replace(/,/g, "");
}

export function millisToHMS(millis: number) {
  let s = roundTo((millis / 1000) % 60, 0.1);
  let m = Math.floor(millis / 1000 / 60) % 60;
  let h = Math.floor(millis / 1000 / 60 / 60);
  return `${h}:${m}:${s}`;
}

export function gcd(a: number, b: number) {
  var _ref;
  while (b) {
    (_ref = [b, a % b]), (a = _ref[0]), (b = _ref[1]);
  }
  return a;
}

export function lcm(a: number, b: number) {
  return (a / gcd(a, b)) * b;
}
