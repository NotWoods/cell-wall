/**
 * Run `transform` over every entry in the map.
 */
export function transformMap<Key, Value, Result>(
	map: ReadonlyMap<Key, Value>,
	transform: (value: Value, key: Key) => Result
): Map<Key, Result> {
	return new Map(
		Array.from(map.entries(), ([key, value]) => {
			return [key, transform(value, key)] as const;
		})
	);
}

export function filterMap<Key, Value, Result extends Value>(
	map: ReadonlyMap<Key, Value>,
	predicate: (value: Value, key: Key) => value is Result
): Map<Key, Result>;
export function filterMap<Key, Value>(
	map: ReadonlyMap<Key, Value>,
	predicate: (value: Value, key: Key) => boolean
): Map<Key, Value>;
export function filterMap<Key, Value>(
	map: ReadonlyMap<Key, Value>,
	predicate: (value: Value, key: Key) => boolean
): Map<Key, Value> {
	return new Map(Array.from(map.entries()).filter(([key, value]) => predicate(value, key)));
}

/**
 * Run `transform` over every entry in the map in parallel.
 */
export async function transformMapAsync<Key, Value, Result>(
	map: ReadonlyMap<Key, Value>,
	transform: (value: Value, key: Key) => Promise<Result>
): Promise<Map<Key, Result>> {
	return new Map(
		await Promise.all(
			Array.from(map.entries(), async ([key, value]) => {
				return [key, await transform(value, key)] as const;
			})
		)
	);
}
