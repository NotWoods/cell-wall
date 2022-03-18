<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import ResetSubmit from '$lib/components/Button/ResetSubmit.svelte';
	import DeviceOptions from '$lib/components/Field/DeviceOptions.svelte';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import { storeEntries, storeKeys } from '$lib/connection/remote-socket';
	import { getRemoteContext } from './__layout.svelte';

	const { state: remoteState } = getRemoteContext();
	const devices = storeEntries(remoteState);
	const deviceIds = storeKeys(remoteState);

	async function submit(data: FormData, action: URL) {
		const backgroundColor = data.get('backgroundColor') as string;
		if (backgroundColor !== '#ffffff') {
			action.searchParams.set('backgroundColor', backgroundColor);
		}

		try {
			const res = await fetch(action.toString(), {
				method: 'post',
				headers: {
					'content-type': 'text/plain'
				},
				body: data.get('text')
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
</script>

<Form class="flex flex-col gap-y-4" action="/api/action/text" onSubmit={submit} let:loading>
	<VerticalField for="control-text" label="Text" let:inputClassName>
		<textarea
			class={inputClassName}
			required
			id="control-text"
			name="text"
			rows="10"
			placeholder=" Apple &#13;&#10;Banana &#13;&#10;Carrot"
		/>
	</VerticalField>

	<HorizontalField for="control-color" label="Background Color">
		<input id="control-color" name="backgroundColor" type="color" value="#ffffff" />
	</HorizontalField>

	<HorizontalField for="control-serial" label="Devices" let:inputClassName>
		<select multiple name="device" id="control-serial" class={inputClassName} value={$deviceIds}>
			<DeviceOptions devices={$devices} />
		</select>
	</HorizontalField>

	<ResetSubmit {loading} />
</Form>
