<script lang="ts">
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';

	let demoEntries: readonly string[] = ['demo1', 'demo2', 'demo3', 'demo4'];
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
