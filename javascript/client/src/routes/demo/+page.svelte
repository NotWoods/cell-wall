<script lang="ts">
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
	import { onMount } from 'svelte';
	import { post } from '../remote/_form';

	const demoEntries: readonly string[] = ['demo1', 'demo2', 'demo3', 'demo4'];

	onMount(async () => {
		const response = await post('/api/device/info/', {
			demo1: { x: 0, y: 0 },
			demo2: { x: 332, y: 0 },
			demo3: { x: 332, y: 236 },
			demo4: { x: 0, y: 472 }
		});
		console.log('Pre-register', response.status);
	});
</script>

<svelte:head>
	<title>CellWall Demo</title>
</svelte:head>

<TopBar />
<RemoteFrame fullWidth>
	<div class="demo-wall mx-auto">
		{#each demoEntries as id (id)}
			<iframe
				class="demo-cell shadow-lg bg-zinc-900 h-full w-full"
				src="/cell?id={id}&autojoin"
				title={id}
				allow="fullscreen 'none'"
				style="grid-area: {id}"
			/>
		{/each}
	</div>
</RemoteFrame>

<style>
	.demo-wall {
		display: grid;
		height: 50rem;
		width: 60rem;
		gap: 1rem;
		grid-template:
			'demo1 demo2' 2fr
			'demo1 demo3' 2fr
			'demo4 demo4' 3fr
			/ 1fr 2fr;
	}
</style>
