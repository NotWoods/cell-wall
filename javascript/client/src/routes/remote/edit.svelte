<script lang="ts" context="module">
	import { createLoadWithDevices, Props } from './_load';

	export const load = createLoadWithDevices();
</script>

<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import PowerButton from './custom/_PowerButton.svelte';
	import Field from '../../lib/components/_Field.svelte/Field.svelte';
	import DeviceOption from './_DeviceOption.svelte';
	import { formDataAsSearchParams } from './_form';

	export let devices: Props['devices'];

	// serial from selected device
	let selectedDeviceSerial = devices[0]?.serial;

	$: selectedCell = devices.find((cell) => cell.serial === selectedDeviceSerial);

	async function submit(formData: FormData, action: URL) {
		const res = await fetch(action.toString(), {
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formDataAsSearchParams(formData)
		});

		console.log(await res.json());
	}
</script>

<Form action="/api/device/{selectedDeviceSerial}" onSubmit={submit} let:loading>
	<Field htmlFor="control-serial" label="Device">
		<div class="select">
			<select name="serial" bind:value={selectedDeviceSerial} id="control-serial">
				{#each devices as device (device.serial)}
					<DeviceOption {device} />
				{/each}
			</select>
		</div>
	</Field>

	<Field htmlFor="control-connected" label="Connected">
		<input
			type="checkbox"
			id="control-connected"
			name="connected"
			disabled
			checked={selectedCell?.connected ?? false}
		/>
	</Field>

	<div class="field is-horizontal">
		<div class="field-label is-normal"><span class="label">Power</span></div>
		<div class="field-body">
			<div class="buttons has-addons">
				<PowerButton serial={selectedDeviceSerial} value={false}>Off</PowerButton>
				<PowerButton serial={selectedDeviceSerial} value={true}>On</PowerButton>
			</div>
		</div>
	</div>

	<Field htmlFor="control-deviceName" label="Device Name">
		<input
			id="control-deviceName"
			class="input"
			name="deviceName"
			type="text"
			value={selectedCell?.info?.deviceName ?? ''}
		/>
	</Field>

	<Field htmlFor="control-width" label="Width">
		<input
			id="control-width"
			class="input"
			name="width"
			type="number"
			min={0}
			value={selectedCell?.info?.width ?? ''}
		/>
	</Field>
	<Field htmlFor="control-height" label="Height">
		<input
			id="control-height"
			class="input"
			name="height"
			type="number"
			min={0}
			value={selectedCell?.info?.height ?? ''}
		/>
	</Field>

	<Field htmlFor="control-x" label="X Position">
		<input
			id="control-x"
			class="input"
			name="x"
			type="number"
			value={selectedCell?.info?.x ?? ''}
		/>
	</Field>
	<Field htmlFor="control-y" label="Y Position">
		<input
			id="control-y"
			class="input"
			name="y"
			type="number"
			value={selectedCell?.info?.y ?? ''}
		/>
	</Field>

	<Field htmlFor="control-server" label="Asset Server">
		<input
			id="control-server"
			class="input"
			name="server"
			type="url"
			value={selectedCell?.info?.server ?? ''}
		/>
	</Field>

	<div class="field is-grouped is-grouped-right" style="margin-top: 3rem">
		<SubmitButton {loading} />
	</div>
</Form>
