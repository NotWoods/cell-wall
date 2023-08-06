<script lang="ts">
  import { page } from '$app/stores';
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
</script>

<TopBar class="bg-red-800" />
<RemoteFrame>
	<h1 class="mt-0 mb-2 text-4xl font-light">{$page.status} Error</h1>
	<p class="my-4">
		{#if $page.error?.message}
			{$page.error.message}
		{:else}
			Encounter an error
		{/if}
	</p>
</RemoteFrame>
