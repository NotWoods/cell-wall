import type { CellState, CellStateImage, CellStateWeb } from '@cell-wall/cell-state';
import { SERVER_ADDRESS } from '../env';

export function toUri(state: CellState, base: string | URL = SERVER_ADDRESS): URL {
	const { type, ...props } = state;
	switch (type.toUpperCase()) {
		case 'WEB': {
			const web = props as CellStateWeb;
			return new URL(web.url, base);
		}
		case 'IMAGE': {
			const imgProps = props as CellStateImage;
			imgProps.src = new URL(imgProps.src, base).toString();
			// fall through
		}
		default: {
			const url = new URL(`cellwall://${type}`);
			for (const [key, value] of Object.entries(props)) {
				url.searchParams.append(key, value);
			}
			return url;
		}
	}
}
