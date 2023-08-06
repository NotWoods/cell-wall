<script lang="ts">
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';

	const buttonClassNames =
		'px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50';

	export let data: import('./$types').PageData;
</script>

<svelte:head>
	<title>SDK Login | CellWall</title>
</svelte:head>

<p class="mb-6">Connect to third party APIs to use in CellWall.</p>

<HorizontalField label="Google">
	{#if data.googleAuthUrl}
		<a class={buttonClassNames} href={data.googleAuthUrl}>Sign in to Google</a>
	{:else}
		<button class={buttonClassNames} type="button" disabled>Logged in to Google</button>
	{/if}
</HorizontalField>
