import { derived, writable, type Readable } from 'svelte/store';

interface Lock {
	active: Readable<boolean>;
	error: Readable<Error | undefined>;
	release: () => Promise<void>;
}

function lockState() {
	const state = writable<{ active: boolean; error?: Error }>({
		active: false
	});

	return {
		state,
		active: derived(state, ($state) => $state.active),
		error: derived(state, ($state) => $state.error)
	};
}

export function requestFullScreen(): Lock {
	const controller = new AbortController();
	const { state, ...stores } = lockState();

	async function enterFullScreen() {
		try {
			await document.documentElement.requestFullscreen().then(
				() => state.set({ active: true }),
				(error) => state.set({ active: false, error })
			);
			state.set({ active: true });
		} catch (error) {
			if (error instanceof Error) {
				state.set({ active: false, error });
			} else {
				throw error;
			}
		}
	}

	enterFullScreen();

	document.addEventListener(
		'fullscreenchange',
		() => {
			state.set({ active: Boolean(document.fullscreenElement) });
		},
		controller
	);

	return {
		...stores,
		async release() {
			controller.abort();
			await document.exitFullscreen();
		}
	};
}

/**
 * Request a wake lock and keep it active until it's released.
 * Returns undefined if wake lock is not supported.
 */
export function requestWakeLock(): Lock | undefined {
	/* eslint-disable no-inner-declarations, svelte/no-inner-declarations */
	if ('wakeLock' in navigator) {
		const controller = new AbortController();
		let wakeLock: WakeLockSentinel | undefined;
		const { state, ...stores } = lockState();

		async function requestNewLock() {
			try {
				wakeLock = await navigator.wakeLock.request('screen');
				state.set({ active: true });

				wakeLock.addEventListener(
					'release',
					() => {
						state.set({ active: false });
					},
					controller
				);
			} catch (error) {
				if (error instanceof DOMException) {
					state.set({ active: false, error });
				} else {
					throw error;
				}
			}
		}

		function handleVisiblityChange() {
			if (wakeLock !== null && document.visibilityState === 'visible') {
				requestNewLock();
			}
		}

		requestNewLock();

		document.addEventListener('visibilitychange', handleVisiblityChange, controller);
		document.addEventListener('fullscreenchange', handleVisiblityChange, controller);

		return {
			...stores,
			async release() {
				controller.abort();
				await wakeLock?.release();
			}
		};
	} else {
		return undefined;
	}
}
