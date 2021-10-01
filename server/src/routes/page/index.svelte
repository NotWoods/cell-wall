<script context="module" lang="ts">
	import { CellStateType } from '$lib/cells';
	import { socketStore } from '$lib/repository/client';
	import type { CellData } from '$lib/repository/interface';
	import { derived } from 'svelte/store';

	const ws = derived(
		socketStore('ws://localhost:3000', '{}'),
		(json) => JSON.parse(json) as Record<string, CellData>
	);

	function stateToUrl({ state, info }: Partial<CellData> = {}) {
		switch (state?.type) {
			case CellStateType.WEB:
				return new URL(state.url, info?.server);
			default:
				return undefined;
		}
	}
</script>

<script lang="ts">
	export let serial: string;

	let anchor: HTMLAnchorElement | undefined;

	$: cellData = $ws[serial];
	$: href = stateToUrl(cellData)?.href ?? '#';

	$: {
		console.log(cellData);
		anchor?.click();
	}
</script>

<a hidden {href} bind:this={anchor}>Refresh</a>
