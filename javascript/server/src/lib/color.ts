// Corresponds to 900 level colors from Tailwind
const RAINBOW_COLORS = [
	'#0F172A', // Slate
	'#7F1D1D', // Red
	'#7C2D12', // Orange
	'#78350F', // Amber
	'#713F12', // Yellow
	'#365314', // Lime
	'#14532D', // Green
	'#064E3B', // Emerald
	'#134E4A', // Teal
	'#164E63', // Cyan
	'#0C4A6E', // Sky
	'#1E3A8A', // Blue
	'#312E81', // Indigo
	'#4C1D95', // Violet
	'#581C87', // Purple
	'#701A75', // Fuchsia
	'#831843', // Pink
	'#881337' // Rose
];

export class RandomColor {
	private unusedColors!: string[];

	constructor(private readonly colors = RAINBOW_COLORS) {
		if (colors.length === 0) {
			throw new TypeError('No colors provided');
		}

		this.reset();
	}

	reset() {
		this.unusedColors = this.colors.slice();
	}

	next() {
		const randomIndex = Math.floor(Math.random() * this.unusedColors.length);
		const color = this.unusedColors[randomIndex];

		// Remove the color from the list of unused colors
		this.unusedColors.splice(randomIndex, 1);
		// Reset the list of unused colors if it's empty
		if (this.unusedColors.length === 0) {
			this.reset();
		}

		return color;
	}
}
