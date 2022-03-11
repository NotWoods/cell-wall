<script lang="ts">
	import WithTopBar from '$lib/components/WithTopBar.svelte';
</script>

<svelte:head>
	<title>CellWall Demo</title>
</svelte:head>

<WithTopBar>
	<iframe src="/cell?id=demo1" title="Demo 1" />
	<iframe src="/cell?id=demo2" title="Demo 2" />
	<iframe src="/cell?id=demo3" title="Demo 3" />
	<iframe src="/cell?id=demo4" title="Demo 4" />
</WithTopBar>
