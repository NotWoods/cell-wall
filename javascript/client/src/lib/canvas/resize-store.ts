import type { Rectangle } from '@cell-wall/shared';
import { derived, Readable, readable } from 'svelte/store';

function resizeObserverStore(element: Element | undefined) {
	if (element) {
		return readable<ResizeObserverEntry | undefined>(undefined, (set) => {
			const resizeObserver = new ResizeObserver((entries) => set(entries[0]));

			resizeObserver.observe(element);
			return () => resizeObserver.unobserve(element);
		});
	} else {
		return readable(undefined);
	}
}

export function elementSizeStore(element: Element | undefined): Readable<Rectangle | undefined> {
	return derived(resizeObserverStore(element), ($resizeObserver) => {
		if ($resizeObserver) {
			if ($resizeObserver.contentBoxSize) {
				const boxSize = $resizeObserver.contentBoxSize[0];
				return {
					width: boxSize.inlineSize,
					height: boxSize.blockSize
				};
			} else {
				const rect = $resizeObserver.contentRect;
				return {
					width: rect.width,
					height: rect.height
				};
			}
		} else {
			return undefined;
		}
	});
}
