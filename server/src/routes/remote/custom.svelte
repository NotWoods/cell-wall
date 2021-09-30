<script lang="ts" context="module">
	import { allCellStateSchemas, getTypeFromSchema } from '$lib/cells';
	import { createLoadWithDevices, Props } from './_load';

	export const load = createLoadWithDevices();
</script>

<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import ControllerFields from './custom/_ControllerFields.svelte';
	import PowerButton from './custom/_PowerButton.svelte';
	import TypeTab from './custom/_TypeTab.svelte';
	import DeviceOption from './_DeviceOption.svelte';
	import Field from './_Field.svelte';
	import { post } from './_form';

	export let devices: Props['devices'];

	// Selected schema type
	let selectedType = 'BLANK';
	// serial from selected device
	let selectedDevice = '';

	$: activeSchema = allCellStateSchemas.find(
		(schema) => getTypeFromSchema(schema) === selectedType
	);

	function handleSelect(event: CustomEvent<string>) {
		selectedType = event.detail;
	}

	async function submit(formData: FormData, action: URL) {
		const data = Object.fromEntries(formData);

		await post(action.toString(), {
			...data,
			type: selectedType
		});
	}
</script>

<nav class="tabs is-centered">
	<ul>
		{#each allCellStateSchemas as schema (getTypeFromSchema(schema))}
			<TypeTab selected={selectedType} {schema} on:click={handleSelect} />
		{/each}
	</ul>
</nav>

<Form action="/api/device/state/{selectedDevice}" onSubmit={submit} let:loading>
	<Field htmlFor="control-serial" label="Device">
		<div class="select">
			<select bind:value={selectedDevice} id="control-serial">
				<option value="">All devices</option>
				{#each devices as device (device.serial)}
					<DeviceOption {device} />
				{/each}
			</select>
		</div>
	</Field>

	<div class="field is-horizontal">
		<div class="field-label is-normal"><span class="label">Power</span></div>
		<div class="field-body">
			<div class="buttons has-addons">
				<PowerButton serial={selectedDevice} value={false}>Off</PowerButton>
				<PowerButton serial={selectedDevice} value={true}>On</PowerButton>
			</div>
		</div>
	</div>

	<ControllerFields schema={activeSchema} />

	<div class="field is-grouped is-grouped-right" style="margin-top: 3rem">
		<p class="control">
			<button type="reset" class="button is-light">Reset</button>
		</p>
		<SubmitButton {loading} />
	</div>
</Form>
