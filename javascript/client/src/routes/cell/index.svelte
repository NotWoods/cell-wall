<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		return {
			props: {
				id: url.searchParams.get('id') || '',
				autoJoin: url.searchParams.has('autojoin')
			}
		};
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
	import { requestFullScreen, requestWakeLock } from '$lib/wakelock';

	export let id = '';
	export let autoJoin = false;

	async function submit() {
		requestFullScreen();
		requestWakeLock();

		await goto(`/cell/frame/blank?id=${id}`, { replaceState: false });
	}

	$: {
		if (autoJoin && browser) {
			submit();
		}
	}
</script>

<svelte:head>
	<title>New Cell | CellWall</title>
</svelte:head>

{#if !autoJoin}
	<TopBar />
{/if}
<RemoteFrame>
	<Form
		class="flex flex-col gap-y-4"
		action="/cell/frame/blank"
		method="get"
		onSubmit={submit}
		let:loading
	>
		<VerticalField for="control-id" label="ID" let:inputClassName>
			<input
				id="control-id"
				class={inputClassName}
				name="id"
				type="text"
				required
				bind:value={id}
			/>
		</VerticalField>

		<ResetSubmit {loading} />
	</Form>
</RemoteFrame>
