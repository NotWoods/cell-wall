<script lang="ts" context="module">
	import { createLoadWithDevices, Props } from './_load';

	export const load = createLoadWithDevices();
</script>

<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';
	import PowerButtons from './custom/_PowerButtons.svelte';
	import DeviceOption from './_DeviceOption.svelte';
	import { formDataAsSearchParams } from './_form';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';

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

<Form
	class="flex flex-col gap-y-4"
	action="/api/device/{selectedDeviceSerial}"
	onSubmit={submit}
	let:loading
>
	<HorizontalField for="control-serial" label="Device" let:inputClassName>
		<select
			class={inputClassName}
			name="serial"
			bind:value={selectedDeviceSerial}
			id="control-serial"
		>
			{#each devices as device (device.serial)}
				<DeviceOption {device} />
			{/each}
		</select>
	</HorizontalField>

	<HorizontalField for="control-connected" label="Connected" let:inputClassName>
		<input
			type="checkbox"
			id="control-connected"
			name="connected"
			disabled
			checked={selectedCell?.connected ?? false}
		/>
	</HorizontalField>

	<HorizontalField label="Power">
		<PowerButtons serial={selectedDeviceSerial} />
	</HorizontalField>

	<HorizontalField for="control-deviceName" label="Device Name" let:inputClassName>
		<input
			id="control-deviceName"
			class={inputClassName}
			name="deviceName"
			type="text"
			value={selectedCell?.info?.deviceName ?? ''}
			placeholder="Pixel 10"
		/>
	</HorizontalField>

	<HorizontalField for="control-width" label="Width" let:inputClassName>
		<input
			id="control-width"
			class={inputClassName}
			name="width"
			type="number"
			min={0}
			value={selectedCell?.info?.width ?? ''}
			placeholder="900"
		/>
	</HorizontalField>
	<HorizontalField for="control-height" label="Height" let:inputClassName>
		<input
			id="control-height"
			class={inputClassName}
			name="height"
			type="number"
			min={0}
			value={selectedCell?.info?.height ?? ''}
			placeholder="2100"
		/>
	</HorizontalField>

	<HorizontalField for="control-x" label="X Position" let:inputClassName>
		<input
			id="control-x"
			class={inputClassName}
			name="x"
			type="number"
			value={selectedCell?.info?.x ?? ''}
			placeholder="10"
		/>
	</HorizontalField>
	<HorizontalField for="control-y" label="Y Position" let:inputClassName>
		<input
			id="control-y"
			class={inputClassName}
			name="y"
			type="number"
			value={selectedCell?.info?.y ?? ''}
			placeholder="0"
		/>
	</HorizontalField>

	<HorizontalField for="control-server" label="Asset Server" let:inputClassName>
		<input
			id="control-server"
			class={inputClassName}
			name="server"
			type="url"
			value={selectedCell?.info?.server ?? ''}
			placeholder="http://192.168.0.1"
		/>
	</HorizontalField>

	<div class="field is-grouped is-grouped-right" style="margin-top: 3rem">
		<SubmitButton {loading} />
	</div>
</Form>
