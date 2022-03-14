<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		return {
			props: {
				id: url.searchParams.get('id') || '',
				deviceName: url.searchParams.get('name') || '',
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
	import type { CellInfo } from '@cell-wall/cell-state';
	import { post } from '../remote/_form';
	import { windowSizeStore } from '$lib/connection/window-size';

	const windowSize = windowSizeStore();

	export let id = '';
	export let deviceName = '';
	export let autoJoin = false;

	async function submit(formData: FormData, action: URL) {
		const data: CellInfo = {
			serial: formData.get('id') as string,
			deviceName: formData.get('deviceName') as string,
			width: $windowSize?.innerWidth,
			height: $windowSize?.innerHeight
		};
		console.log('submitting', data);

		requestFullScreen();
		requestWakeLock();

		await post(action.toString(), data);
		await goto(`/cell/frame/blank?id=${id}`, { replaceState: false });
	}

	$: {
		if (autoJoin && browser) {
			const form = document.querySelector('form')!;
			submit(new FormData(form), new URL(form.action));
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
	<Form class="flex flex-col gap-y-4" action="/api/device/{id}" onSubmit={submit} let:loading>
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
		<VerticalField for="control-name" label="Name" let:inputClassName>
			<input
				id="control-name"
				class={inputClassName}
				name="deviceName"
				type="text"
				required
				bind:value={deviceName}
			/>
		</VerticalField>
		<input type="hidden" name="width" value={$windowSize?.innerWidth} />
		<input type="hidden" name="height" value={$windowSize?.innerHeight} />

		<ResetSubmit {loading} />
	</Form>
</RemoteFrame>
