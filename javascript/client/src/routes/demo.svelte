<script lang="ts">
	import WithTopBar from '$lib/components/WithTopBar.svelte';

	interface DemoEntry {
		id: string;
		name: string;
	}

	let demoEntries: readonly DemoEntry[] = [
		{ id: 'demo1', name: 'Demo_1' },
		{ id: 'demo2', name: 'Demo_2' },
		{ id: 'demo3', name: 'Demo_3' },
		{ id: 'demo4', name: 'Demo_Tablet' }
	];
</script>

<svelte:head>
	<title>CellWall Demo</title>
</svelte:head>

<WithTopBar fullWidth>
	<div class="demo-wall mx-auto">
		{#each demoEntries as { id, name } (id)}
			<iframe
				class="demo-cell shadow-lg bg-zinc-900 h-full w-full"
				src="/cell?id={id}&name={name}&autojoin"
				title={name}
				style="grid-area: {id}"
			/>
		{/each}
	</div>
</WithTopBar>

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
