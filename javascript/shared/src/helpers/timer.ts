/**
 * Resolves after `delay` milliseconds.
 * @param delay  The number of milliseconds to wait before fulfilling the promise.
 * @param options.signal An optional `AbortSignal` that can be used to cancel the scheduled timer.
 */
function setTimeoutAsync(delay: number, options: { signal?: AbortSignal } = {}): Promise<void> {
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

export { setTimeoutAsync as setTimeout };
