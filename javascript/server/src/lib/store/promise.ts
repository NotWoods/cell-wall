import { readable, type Readable, type Subscriber, type Unsubscriber } from 'svelte/store';

/**
 * Call set when the promise resolves, and abort when the unsubscriber is called.
 */
export function setWhenDone<T>(promise: Promise<T>, set: Subscriber<T>): Unsubscriber {
	let invalidated = false;

	promise.then((powered) => {
		if (!invalidated) {
			set(powered);
		}
	});

	return () => {
		invalidated = true;
	};
}

/**
 * Returns the value of a resolved promise wrapped in a readable store.
 * @param promise The promise to wait for.
 */
export function resolvedPromiseStore<T>(promise: PromiseLike<T>): Readable<T | undefined> {
	return readable<T>(undefined, (set) => {
		promise.then(set);
	});
}
