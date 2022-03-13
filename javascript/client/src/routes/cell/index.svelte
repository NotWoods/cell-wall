<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		return {
			props: {
				id: url.searchParams.get('id') || ''
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import WithTopBar from '$lib/components/WithTopBar.svelte';
	import { requestWakeLock } from '$lib/wakelock';
	import type { CellInfo } from '@cell-wall/cell-state';
	import { post } from '../remote/_form';

	export let id = '';

	async function submit(formData: FormData, action: URL) {
		const data: CellInfo = {
			serial: formData.get('id') as string,
			deviceName: formData.get('deviceName') as string,
			width: window.innerWidth,
			height: window.innerHeight
		};

		try {
			document.documentElement.requestFullscreen();
		} catch (error) {
			console.error('Could not request fullscreen', error);
		}
		requestWakeLock();
		await post(action.toString(), data);
		await goto(`/cell/frame/blank?id=${id}`, { replaceState: false });
	}
</script>

<svelte:head>
	<title>New Cell | CellWall</title>
</svelte:head>

<WithTopBar>
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
			<input id="control-name" class={inputClassName} name="deviceName" type="text" required />
		</VerticalField>

		<ResetSubmit {loading} />
	</Form>
</WithTopBar>
