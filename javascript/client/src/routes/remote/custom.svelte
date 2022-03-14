<script lang="ts">
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import Tabs from '$lib/components/Tabs/Tabs.svelte';
	import { storeValues } from '$lib/connection/remote-socket';
	import { allCellStateSchemas, getTypeFromSchema } from '@cell-wall/cell-state';
	import ControllerFields from './custom/_ControllerFields.svelte';
	import PowerButtons from './custom/_PowerButtons.svelte';
	import TypeTab from './custom/_TypeTab.svelte';
	import DeviceOption from './_DeviceOption.svelte';
	import { post } from './_form';
	import { getRemoteContext } from './__layout.svelte';

	const { state: remoteState } = getRemoteContext();
	const devices = storeValues(remoteState);

	// Selected schema type
	let selectedType = 'BLANK';
	// serial from selected device
	let selectedDeviceSerial = '';

	$: selectedDevice = $remoteState.get(selectedDeviceSerial);
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
	action="/api/device/state/{selectedDeviceSerial}"
	onSubmit={submit}
	let:loading
>
	<HorizontalField for="control-serial" label="Device" let:inputClassName>
		<select
			class="{inputClassName} cursor-pointer"
			bind:value={selectedDeviceSerial}
			id="control-serial"
		>
			<option value="">All devices</option>
			{#each $devices as device (device.serial)}
				<DeviceOption {device} />
			{/each}
		</select>
	</HorizontalField>

	{#if selectedDevice?.connection === 'android'}
		<HorizontalField label="Power">
			<PowerButtons serial={selectedDeviceSerial} />
		</HorizontalField>
	{/if}

	{#key selectedType}
		<ControllerFields schema={activeSchema} state={selectedDevice?.state} />
	{/key}

	<ResetSubmit {loading} />
</Form>
