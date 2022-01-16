<script lang="ts" context="module">
	import { mergeAbortSignals, wait } from '$lib/timer';
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
			const signal = mergeAbortSignals(dismissController.signal, options.signal);

			const snackbarPromise = this._lastSnackbar
				.catch(() => {})
				.then(() => {
					if (signal?.aborted) return;

					this._currentSnackbarData.set(snackbarData);
					return wait(duration, { signal }).finally(() => {
						this._currentSnackbarData.set(undefined);
					});
				});
			this._lastSnackbar = snackbarPromise;
			return snackbarPromise;
		}
	}
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';

	export let data: SnackbarData | undefined;
</script>

{#if data}
	<aside
		role="alert"
		class="fixed inset-4 top-auto bg-gray-200 text-black mx-auto px-4 py-2 max-w-lg"
		transition:fly={{ y: 100, duration: 300 }}
	>
		<button
			type="button"
			class="rounded-md float-right text-gray-600 hover:text-black"
			title="Dismiss snackbar"
			on:click={data.dismiss}
		>
			<span class="sr-only">Dismiss snackbar</span>
			<svg
				class="h-6 w-6 transition-colors"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		{data.message}
	</aside>
{/if}
