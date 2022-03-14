<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ status, error }) => {
		return {
			props: { status, error }
		};
	};
</script>

<script lang="ts">
	export let status: number;
	export let error: Error;
</script>

<main>
	<h1 class="mt-0 mb-2 text-4xl font-light">{status} Error</h1>
	<p class="my-4">
		{#if error.message}
			{error.message}
		{:else}
			Encounter an error
		{/if}
	</p>

	<pre>{error.stack}</pre>
</main>

<style>
	main {
		background-color: #991b1b;
		color: white;
	}
</style>
