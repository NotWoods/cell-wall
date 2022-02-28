<script lang="ts">
	import { goto } from '$app/navigation';
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
	import type { CellInfo } from '@cell-wall/cell-state';
	import 'tailwindcss/tailwind.css';
	import { post } from '../remote/_form';

	let id = '';

	async function submit(formData: FormData, action: URL) {
		const data: CellInfo = {
			serial: formData.get('id') as string,
			deviceName: formData.get('deviceName') as string,
			width: window.innerWidth,
			height: window.innerHeight
		};

		await post(action.toString(), data);
		await goto(`/cell/frame?id=${id}`);
	}
</script>

<svelte:head>
	<title>New Cell | CellWall</title>
</svelte:head>

<TopBar />

<div
	class="bg-slate-900 bg-gradient-to-r"
	style="--tw-gradient-stops: hsl(222deg 47% 11%) 0%, hsl(222deg 45% 12%) 11%, hsl(221deg 43% 13%) 22%,
    hsl(221deg 41% 13%) 33%, hsl(220deg 39% 14%) 44%, hsl(219deg 38% 15%) 56%,
    hsl(219deg 36% 15%) 67%, hsl(218deg 35% 16%) 78%, hsl(218deg 34% 17%) 89%,
    hsl(217deg 33% 17%) 100%; min-height: calc(100vh - 3.25rem);"
>
	<main class="max-w-7xl mx-auto p-2 py-4 sm:p-6 lg:p-8">
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
	</main>
</div>
