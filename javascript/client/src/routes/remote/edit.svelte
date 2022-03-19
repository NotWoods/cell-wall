<script lang="ts">
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import { connectionToString } from '$lib/components/Field/DeviceOption.svelte';
	import DeviceOptions from '$lib/components/Field/DeviceOptions.svelte';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import { storeEntries, storeKeys } from '$lib/connection/remote-socket';
	import type { CellInfo } from '@cell-wall/shared';
	import PowerButtons from './custom/_PowerButtons.svelte';
	import { post } from './_form';
	import { getRemoteContext } from './__layout.svelte';

	const { state: remoteState } = getRemoteContext();
	const devices = storeEntries(remoteState);
	const devicesIds = storeKeys(remoteState);

	// serial from selected device
	let selectedDeviceSerial: string | undefined;

	$: firstDevice = $devicesIds[0];
	$: selectedCell = $remoteState.get(selectedDeviceSerial ?? firstDevice);
	$: connection = connectionToString(selectedCell?.connection);

	async function submit(formData: FormData, action: URL) {
		function getNumber(key: string) {
			const value = formData.get(key);
			if (typeof value === 'string') {
				return Number(value);
			}
			return undefined;
		}

		const data: CellInfo = {
			serial: formData.get('serial') as string,
			deviceName: formData.get('deviceName') as string,
			width: getNumber('width'),
			height: getNumber('height'),
			x: getNumber('x'),
			y: getNumber('y'),
			server: formData.get('server') as string
		};

		await post(action.toString(), data);
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
			<DeviceOptions devices={$devices} />
		</select>
	</HorizontalField>

	<HorizontalField for="control-connection" label="Connection" let:inputClassName>
		<input
			id="control-connection"
			name="connection"
			type="text"
			value={connection}
			readonly
			class="{inputClassName} bg-slate-300"
		/>
	</HorizontalField>

	{#if selectedCell?.connection?.includes('android')}
		<HorizontalField label="Power">
			<PowerButtons serial={selectedDeviceSerial} />
		</HorizontalField>
	{/if}

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

	<ResetSubmit {loading} />
</Form>
