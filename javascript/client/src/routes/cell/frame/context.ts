import type { CellState } from '@cell-wall/shared';
import { getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';

export const frameContext = {
	get socket(): WebSocket | undefined {
		return getContext('frame-socket');
	},
	set socket(value: WebSocket | undefined) {
		setContext('frame-socket', value);
	},
	get state(): Readable<CellState> {
		return getContext('frame-state');
	},
	set state(value: Readable<CellState>) {
		setContext('frame-state', value);
	}
};
