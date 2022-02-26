<script lang="ts" context="module">
	import { allCellStateSchemas, getTypeFromSchema } from '@cell-wall/cell-state';
	import { createLoadWithDevices, Props } from './_load';

	export const load = createLoadWithDevices();
</script>

<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import ControllerFields from './custom/_ControllerFields.svelte';
	import PowerButtons from './custom/_PowerButtons.svelte';
	import TypeTab from './custom/_TypeTab.svelte';
	import DeviceOption from './_DeviceOption.svelte';
	import { post } from './_form';
	import Tabs from '$lib/components/Tabs/Tabs.svelte';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import ResetSubmit from './_ResetSubmit.svelte';

	export let devices: Props['devices'];

	// Selected schema type
	let selectedType = 'BLANK';
	// serial from selected device
	let selectedDevice = '';

	$: activeSchema = allCellStateSchemas.find(
		(schema) => getTypeFromSchema(schema) === selectedType
	);

	async function submit(formData: FormData, action: URL) {
		const data = Object.fromEntries(formData);

		await post(action.toString(), {
			...data,
			type: selectedType
		});
	}
</script>

<nav class="mb-6">
	<Tabs>
		{#each allCellStateSchemas as schema (getTypeFromSchema(schema))}
			<TypeTab bind:selectedType {schema} />
		{/each}
	</Tabs>
</nav>

<Form
	id="custom-form"
	class="flex flex-col gap-y-4 px-2"
	role="tabpanel"
	action="/api/device/state/{selectedDevice}"
	onSubmit={submit}
	let:loading
>
	<HorizontalField for="control-serial" label="Device" let:inputClassName>
		<select class="{inputClassName} cursor-pointer" bind:value={selectedDevice} id="control-serial">
			<option value="">All devices</option>
			{#each devices as device (device.serial)}
				<DeviceOption {device} />
			{/each}
		</select>
	</HorizontalField>

	<HorizontalField label="Power">
		<PowerButtons serial={selectedDevice} />
	</HorizontalField>

	<ControllerFields schema={activeSchema} />

	<ResetSubmit {loading} />
</Form>
