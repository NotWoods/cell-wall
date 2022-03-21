<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async () => {
		const response = await fetch('/api/third_party/');

		if (!response.ok) {
			return {
				status: response.status,
				error: new Error(`Could not load, ${response.statusText}`)
			};
		}

		const body = (await response.json()) as { google_authorize_url?: string | undefined };

		return {
			props: {
				googleAuthUrl: body.google_authorize_url
			}
		};
	};
</script>

<script lang="ts">
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';

	const buttonClassNames =
		'px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50';

	export let googleAuthUrl: string | undefined;
</script>

<svelte:head>
	<title>SDK Login | CellWall</title>
</svelte:head>

<p class="mb-6">Connect to third party APIs to use in CellWall.</p>

<HorizontalField label="Google">
	{#if googleAuthUrl}
		<a class={buttonClassNames} href={googleAuthUrl}>Sign in to Google</a>
	{:else}
		<button class={buttonClassNames} type="button" disabled>Logged in to Google</button>
	{/if}
</HorizontalField>
