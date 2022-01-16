<script lang="ts" context="module">
	export * from '../snackbar-host';
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { SnackbarData } from '../snackbar-host';

	export let data: SnackbarData | undefined;
</script>

{#if data}
	<aside
		role="alert"
		class="fixed inset-4 top-auto bg-gray-200 text-black mx-auto px-4 py-2 max-w-lg"
		transition:fly={{ y: 100, duration: 300 }}
	>
		<button
			type="button"
			class="rounded-md float-right text-gray-600 hover:text-black"
			title="Dismiss snackbar"
			on:click={data.dismiss}
		>
			<span class="sr-only">Dismiss snackbar</span>
			<svg
				class="h-6 w-6 transition-colors"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		{data.message}
	</aside>
{/if}
