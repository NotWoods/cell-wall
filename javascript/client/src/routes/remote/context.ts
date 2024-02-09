import { SnackbarHostState } from '$lib/components/snackbar/snackbar-host';
import type { CellData } from '@cell-wall/shared';
import { getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';

export const remoteContext = {
	get socket(): WebSocket | undefined {
		return getContext('remote-socket');
	},
	set socket(value: WebSocket | undefined) {
		setContext('remote-socket', value);
	},
	get state(): Readable<ReadonlyMap<string, CellData>> {
		return getContext('remote-state');
	},
	set state(value: Readable<ReadonlyMap<string, CellData>>) {
		setContext('remote-state', value);
	},
	get snackbarHost(): SnackbarHostState {
		return getContext(SnackbarHostState);
	},
	set snackbarHost(value: SnackbarHostState) {
		setContext(SnackbarHostState, value);
	}
};
