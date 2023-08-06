<script lang="ts">
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import DeviceOptions from '$lib/components/Field/DeviceOptions.svelte';
	import FileInput from '$lib/components/Field/FileInput.svelte';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import { storeEntries, storeKeys } from '$lib/connection/remote-socket';
	import { getRemoteContext } from '../+layout.svelte';

	const { state: remoteState } = getRemoteContext();
	const devices = storeEntries(remoteState);
	const deviceIds = storeKeys(remoteState);

	let fileName = 'No file selected.';

	async function submit(data: FormData, action: URL) {
		const image = data.get('image') as File;
		data.delete('image');

		for (const [key, value] of data) {
			action.searchParams.append(key, value as string);
		}

		try {
			const res = await fetch(action.toString(), {
				method: 'post',
				headers: {
					'content-type': image.type
				},
				body: image
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	function handleChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		fileName = input.files?.[0]?.name || 'New image';
	}
</script>

<Form class="flex flex-col gap-y-4" action="/api/action/image/" onSubmit={submit} let:loading>
	<HorizontalField for="control-image" label="Image">
		<FileInput required accept="image/*" name="image" id="control-image" on:change={handleChange}>
			{fileName}
		</FileInput>
	</HorizontalField>

	<HorizontalField for="control-serial" label="Devices" let:inputClassName>
		<select multiple name="device" id="control-serial" class={inputClassName} value={$deviceIds}>
			<DeviceOptions devices={$devices} />
		</select>
	</HorizontalField>

	<HorizontalField for="control-hozalign" label="Horizontal Alignment" let:inputClassName>
		<select id="control-hozalign" name="horizontalAlign" class={inputClassName}>
			<option value="center">Center</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
		</select>
	</HorizontalField>

	<HorizontalField for="control-veralign" label="Vertical Alignment" let:inputClassName>
		<select id="control-veralign" name="verticalAlign" class={inputClassName}>
			<option value="middle">Middle</option>
			<option value="top">Top</option>
			<option value="bottom">Bottom</option>
		</select>
	</HorizontalField>

	<HorizontalField for="control-resize" label="Resize Mode" let:inputClassName>
		<select id="control-resize" name="resize" class={inputClassName}>
			<option value="bilinearInterpolation">Bilinear</option>
			<option value="bicubicInterpolation">Bicubic</option>
			<option value="hermiteInterpolation">Hermite</option>
			<option value="bezierInterpolation">Bezier</option>
			<option value="nearestNeighbor">Nearest Neighbor</option>
		</select>
	</HorizontalField>

	<HorizontalField for="control-rest" label="Remaining Cells" let:inputClassName>
		<select id="control-rest" name="rest" class={inputClassName}>
			<option value="ignore">Ignore</option>
			<option value="blank">Blank</option>
			<option value="off">Off</option>
		</select>
	</HorizontalField>

	<ResetSubmit {loading} />
</Form>
