import { derived, Readable } from 'svelte/store';

/**
 * Transform a store value into a tuple that includes the previous state.
 */
export function withLastState<T>(
	store: Readable<T>
): Readable<[newState: T, oldState: T | undefined]> {
	let oldState: T | undefined;
	return derived(store, (newState) => {
		const result: [T, T | undefined] = [newState, oldState];
		oldState = newState;
		return result;
	});
}

/**
 * Build maps that only include values that are different from the previous state.
 */
export function onlyNewEntries<K, V>(
	store: Readable<ReadonlyMap<K, V>>
): Readable<ReadonlyMap<K, V>> {
	return derived(withLastState(store), ([newMap, oldMap]) => {
		const changes = new Map(newMap);
		if (oldMap) {
			// Delete state if it was already present
			for (const [serial, state] of oldMap) {
				if (changes.get(serial) === state) {
					changes.delete(serial);
				}
			}
		}
		return changes;
	});
}
