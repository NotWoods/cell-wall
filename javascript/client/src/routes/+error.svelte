<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
	<h1 class="mt-0 mb-2 text-4xl font-light">{$page.status} Error</h1>
	<p class="my-4">
		{#if $page.error?.message}
			{$page.error.message}
		{:else}
			Encounter an error
		{/if}
	</p>
</main>

<style>
	main {
		background-color: #991b1b;
		color: white;
	}
</style>
