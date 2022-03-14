import { browser } from '$app/env';
import { readable } from 'svelte/store';

interface WindowSize {
	innerWidth: number;
	innerHeight: number;
}

/**
 * Returns a Svelte store containing the current window size.
 */
export function windowSizeStore() {
	if (!browser) return readable(undefined);

	function getWindowSize(): WindowSize {
		return {
			innerWidth: window.innerWidth,
			innerHeight: window.innerHeight
		};
	}

	return readable<WindowSize>(getWindowSize(), (set) => {
		function handleResize() {
			set(getWindowSize());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});
}
