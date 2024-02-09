import type { Subscriber, Unsubscriber } from 'svelte/store';

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
