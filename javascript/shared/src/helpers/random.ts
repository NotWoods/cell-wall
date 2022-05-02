export function randomIndex(items: readonly unknown[]): number {
	return Math.floor(Math.random() * items.length);
}

export function randomItem<T>(items: readonly T[]): T {
	return items[randomIndex(items)];
}
