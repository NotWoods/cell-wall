import { Readable, writable } from 'svelte/store';

declare global {
	type WakeLockType = 'screen';

	interface WakeLockSentinel extends EventTarget {
		readonly released: boolean;
		readonly type: WakeLockType;

		release(): Promise<void>;

		onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
		addEventListener(
			type: 'release',
			listener: (this: WakeLockSentinel, ev: Event) => any,
			options?: boolean | AddEventListenerOptions
		): void;
		addEventListener(
			type: string,
			listener: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
	}

	interface WakeLock {
		request(type: WakeLockType): Promise<WakeLockSentinel>;
	}

	interface Navigator {
		readonly wakeLock: WakeLock;
	}
}

/**
 * Request a wake lock and keep it active until it's released.
 * Returns undefined if wake lock is not supported.
 */
export function requestWakeLock():
	| { active: Readable<boolean>; release: () => Promise<void> }
	| undefined {
	/* eslint-disable no-inner-declarations */
	if ('wakeLock' in navigator) {
		const controller = new AbortController();
		let wakeLock: WakeLockSentinel | undefined;
		const active = writable(false);

		async function requestNewLock() {
			try {
				wakeLock = await navigator.wakeLock.request('screen');
				active.set(true);

				wakeLock.addEventListener(
					'release',
					() => {
						active.set(false);
					},
					controller
				);
			} catch (error) {
				if (error instanceof DOMException) {
					console.error(`${error.name}, ${error.message}`);
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
			active,
			async release() {
				controller.abort();
				await wakeLock?.release();
			}
		};
	} else {
		return undefined;
	}
}
