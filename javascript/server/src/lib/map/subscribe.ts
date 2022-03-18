import { derived, Readable, Unsubscriber } from 'svelte/store';

export function subscribeToMapStore<Key, Value>(
	store: Readable<ReadonlyMap<Key, Value>>,
	subscription: (
		newMap: ReadonlyMap<Key, Value>,
		oldMap: ReadonlyMap<Key, Value> | undefined
	) => void
): Unsubscriber {
	let oldMap: ReadonlyMap<Key, Value> | undefined;
	return store.subscribe((newMap) => {
		subscription(newMap, oldMap);
		oldMap = newMap;
	});
}
