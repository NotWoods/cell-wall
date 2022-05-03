import { readable, type Readable } from 'svelte/store';

interface MessageSource extends EventTarget {
	addEventListener(
		type: 'message',
		listener: (event: MessageEvent) => any,
		options?: AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
}

export function messages<T = any>(messageSource: MessageSource): Readable<T | undefined>;
export function messages<T = any>(messageSource: MessageSource, initialState: T): Readable<T>;
export function messages<T = any>(messageSource: MessageSource, initialState?: T) {
	return readable<T>(initialState, (set) => {
		const controller = new AbortController();
		messageSource.addEventListener(
			'message',
			(event: MessageEvent<T>) => set(event.data),
			controller
		);
		return () => controller.abort();
	});
}
