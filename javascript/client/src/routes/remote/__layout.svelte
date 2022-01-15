<script lang="ts">
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
</script>

<svelte:head>
	<title>CellWall Remote</title>
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<TopBar />

<div
	class="bg-slate-900 bg-gradient-to-r"
	style="--tw-gradient-stops: hsl(222deg 47% 11%) 0%, hsl(222deg 45% 12%) 11%, hsl(221deg 43% 13%) 22%,
    hsl(221deg 41% 13%) 33%, hsl(220deg 39% 14%) 44%, hsl(219deg 38% 15%) 56%,
    hsl(219deg 36% 15%) 67%, hsl(218deg 35% 16%) 78%, hsl(218deg 34% 17%) 89%,
    hsl(217deg 33% 17%) 100%; min-height: calc(100vh - 3.25rem);"
>
	<main class="max-w-7xl mx-auto p-2 py-4 sm:p-6 lg:p-8">
		<slot />
	</main>
</div>
