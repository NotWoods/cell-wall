/**
 * Resolves after `delay` milliseconds.
 * @param delay  The number of milliseconds to wait before fulfilling the promise.
 * @param options.signal An optional `AbortSignal` that can be used to cancel the scheduled timer.
 */
export function wait(delay: number, options: { signal?: AbortSignal } = {}): Promise<void> {
	const { signal } = options;
	if (signal?.aborted) {
		return Promise.reject(new Error('AbortError'));
	}

	return new Promise<void>((resolve, reject) => {
		const timeoutId = setTimeout(resolve, delay);
		if (signal) {
			signal.addEventListener('abort', () => {
				clearTimeout(timeoutId);
				reject(new Error('AbortError'));
			});
		}
	});
}

export function mergeAbortSignals(...items: (AbortSignal | undefined)[]): AbortSignal | undefined {
	const signals = items.filter((item): item is AbortSignal => item != undefined);
	if (signals.length <= 1) {
		return signals[0];
	}

	const controller = new AbortController();
	const abort = controller.abort.bind(controller);

	for (const signal of signals) {
		if (signal.aborted) {
			abort();
		} else {
			signal.addEventListener('abort', abort, { once: true, signal: controller.signal });
		}
	}

	return controller.signal;
}
