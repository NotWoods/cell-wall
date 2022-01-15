<script lang="ts">
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
</script>

<svelte:head>
	<title>CellWall Remote</title>
	<link rel="stylesheet" href="https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css" />
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<TopBar />

<main class="section">
	<div class="container">
		<slot />
	</div>
</main>
