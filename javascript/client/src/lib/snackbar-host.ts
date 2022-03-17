import { abortSignalAny } from '$lib/timer';
import { setTimeout } from '@cell-wall/shared';
import { writable, type Readable } from 'svelte/store';

export enum SnackbarDuration {
	SHORT = 1500,
	LONG = 2750
}

export interface SnackbarData {
	message: string;
	duration: number | SnackbarDuration;
	dismiss: () => void;
}

export class SnackbarHostState {
	private readonly _currentSnackbarData = writable<SnackbarData | undefined>(undefined);
	private _lastSnackbar = Promise.resolve();

	get currentSnackbarData(): Readable<SnackbarData | undefined> {
		return this._currentSnackbarData;
	}

	showSnackbar(
		message: string,
		duration: number | SnackbarDuration = SnackbarDuration.SHORT,
		options: { signal?: AbortSignal } = {}
	): Promise<void> {
		const dismissController = new AbortController();
		const snackbarData: SnackbarData = {
			message,
			duration,
			dismiss: dismissController.abort.bind(dismissController)
		};
		const signal = abortSignalAny(dismissController.signal, options.signal);

		const snackbarPromise = this._lastSnackbar
			.catch(() => {
				// ignore errors
			})
			.then(() => {
				if (signal?.aborted) return;

				this._currentSnackbarData.set(snackbarData);
				return setTimeout(duration, { signal }).finally(() => {
					this._currentSnackbarData.set(undefined);
				});
			});
		this._lastSnackbar = snackbarPromise;
		return snackbarPromise;
	}
}
