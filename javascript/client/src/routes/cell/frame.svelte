<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { CellStateType } from '$lib/cells';
	import { socketStore } from '$lib/socket';
	import type { CellData } from '$lib/cells/data';
	import { derived } from 'svelte/store';

	const ws = derived(
		socketStore('ws://localhost:3000', '{}'),
		(json) => JSON.parse(json) as Record<string, CellData>
	);

	export const load: Load = async ({ url }) => {
		const id = url.searchParams.get('id');
		if (!id) {
			return {
				status: 400,
				error: new Error('Missing ID')
			};
		}

		return {
			props: {
				serial: id
			}
		};
	};
</script>

<script lang="ts">
	export let serial: string;

	let frame: HTMLIFrameElement | undefined;

	function stateToUrl({ state, info }: Partial<CellData> = {}) {
		switch (state?.type) {
			case CellStateType.WEB:
				return new URL(state.url, info?.server);
			default:
				return undefined;
		}
	}

	$: cellData = $ws[serial];

	if (frame) {
		frame.src = stateToUrl(cellData)?.href ?? 'about:blank';
	}
</script>

<svelte:head>
	<title>CellWall</title>
</svelte:head>

<iframe title="Cell content" bind:this={frame} />

<style>
	iframe {
		height: 100vh;
		width: 100vw;
	}
</style>
