export function asArray<T>(items: T | T[]): T[];
export function asArray<T>(items: T | readonly T[]): readonly T[];
export function asArray<T>(items: T | readonly T[]): readonly T[] {
	// @ts-expect-error isArray doesn't handle readonly arrays properly
	return Array.isArray(items) ? items : [items];
}

/**
 * Returns a new map only containing matching keys.
 * @param map Map to extract items from
 * @param keys Subset of keys in the map
 */
export function getAll<Key, Value>(
	map: ReadonlyMap<Key, Value>,
	keys: readonly Key[]
): Map<Key, Value> {
	const result = new Map<Key, Value>();
	for (const key of keys) {
		const value = map.get(key);
		if (value !== undefined) {
			result.set(key, value);
		}
	}
	return result;
}
