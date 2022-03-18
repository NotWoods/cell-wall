import { readable, Readable } from 'svelte/store';

/**
 * Returns the value of a resolved promise wrapped in a readable store.
 * @param promise The promise to wait for.
 */
export function resolvedPromiseStore<T>(promise: PromiseLike<T>): Readable<T | undefined> {
	return readable<T>(undefined, (set) => {
		promise.then(set);
	});
}
