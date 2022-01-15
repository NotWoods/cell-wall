export interface PromisePendingResult {
	status: 'pending';
}

export interface PromiseRejectedResult {
	status: 'rejected';
	reason: unknown;
}

/**
 * Promise result monad based on `Promise.allSettled`.
 */
export type PromiseResult<T> =
	| PromisePendingResult
	| PromiseFulfilledResult<T>
	| PromiseRejectedResult;

export const PENDING: PromisePendingResult = { status: 'pending' };

export function toMonad<T>(
	promise: Promise<T>,
	callback: (result: PromiseResult<T>) => void
): void {
	callback(PENDING);
	promise.then(
		(value: T) => callback({ status: 'fulfilled', value }),
		(reason: unknown) => callback({ status: 'rejected', reason })
	);
}
