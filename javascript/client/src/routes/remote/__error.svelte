<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ status, error }) => {
		return {
			props: { status, error }
		};
	};
</script>

<script lang="ts">
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';

	export let status: number;
	export let error: Error;
</script>

<TopBar class="bg-red-800" />
<RemoteFrame>
	<h1 class="mt-0 mb-2 text-4xl font-light">{status} Error</h1>
	<p class="my-4">
		{#if error.message}
			{error.message}
		{:else}
			Encounter an error
		{/if}
	</p>

	<pre>{error.stack}</pre>
</RemoteFrame>
