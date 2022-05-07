import { a as randomIndex } from "./random-ca7fbb84.js";
const RAINBOW_COLORS = [
  "#0F172A",
  "#7F1D1D",
  "#7C2D12",
  "#78350F",
  "#713F12",
  "#365314",
  "#14532D",
  "#064E3B",
  "#134E4A",
  "#164E63",
  "#0C4A6E",
  "#1E3A8A",
  "#312E81",
  "#4C1D95",
  "#581C87",
  "#701A75",
  "#831843",
  "#881337"
];
class RandomColor {
  constructor(colors = RAINBOW_COLORS) {
    this.colors = colors;
    if (colors.length === 0) {
      throw new TypeError("No colors provided");
    }
    this.reset();
  }
  reset() {
    this.unusedColors = this.colors.slice();
  }
  next() {
    if (this.unusedColors.length <= 1) {
      const color2 = this.unusedColors[0];
      this.reset();
      return color2;
    }
    const index = randomIndex(this.unusedColors);
    const color = this.unusedColors[index];
    this.unusedColors.splice(index, 1);
    return color;
  }
}
export { RAINBOW_COLORS as R, RandomColor as a };
