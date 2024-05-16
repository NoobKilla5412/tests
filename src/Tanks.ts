function getValue(wind: number) {
  const distance = 2; // This is the distance between the tanks in inches.
  return Math.round(-3.7151242 * distance + 0.16 * wind + 88);
}

console.log(getValue(-5));
