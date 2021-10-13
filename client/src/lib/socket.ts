import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';
import { browser } from '$app/env';

export function socketStore<T>(url: string | URL, defaultValue: T): Readable<T> {
	if (browser) {
		const ws = new WebSocket(url);

		return readable(defaultValue, (set) => {
			const controller = new AbortController();

			ws.addEventListener(
				'message',
				(event) => {
					console.log(event.data);
					set(event.data);
				},
				controller
			);

			return () => controller.abort();
		});
	} else {
		return readable(defaultValue);
	}
}
