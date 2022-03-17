/**
 * AbortSignal that fires after any given abort signal fires
 */
export function abortSignalAny(...items: (AbortSignal | undefined)[]): AbortSignal | undefined {
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
