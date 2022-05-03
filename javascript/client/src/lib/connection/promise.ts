import { derived, type Readable } from 'svelte/store';

interface PromisePendingResult {
	status: 'pending';
}

interface PromiseRejectedResult {
	status: 'rejected';
	reason: unknown;
}

export type PromiseSettledResult<T> =
	| PromisePendingResult
	| PromiseFulfilledResult<T>
	| PromiseRejectedResult;

export function settled<R>(store: Readable<R>, fn: (state: R, signal: AbortSignal) => Promise<R>) {
	return derived(store, (state, set) => {
		const controller = new AbortController();

		fn(state, controller.signal)
			.then((ranges) => set({ status: 'fulfilled', value: ranges }))
			.catch((error) => set({ status: 'rejected', reason: error }));

		return () => controller.abort();
	});
}
