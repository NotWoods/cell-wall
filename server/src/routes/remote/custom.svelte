<script lang="ts">
	import {
		getTypeFromSchema,
		cellStateBlankSchema,
		cellStateWebSchema,
		cellStateTextSchema,
		cellStateImageSchema
	} from '@cell-wall/cells';
	import type { CellInfo } from '@cell-wall/cells';
	import { post, formData } from './_form';
	import TypeTab from '../TypeTab.svelte';
	import Field from '../Field.svelte';
	import PowerButton from '../PowerButton.svelte';
	import ControllerFields from '../ControllerFields.svelte';

	export let devices: { serial: string; info: CellInfo }[];

	const types = [
		cellStateBlankSchema,
		cellStateWebSchema,
		cellStateTextSchema,
		cellStateImageSchema
	];
	let selectedType = 'BLANK';
	let selectedDevice = '';
	let form: HTMLFormElement;
	let loading: Promise<void> = Promise.resolve();

	$: activeSchema = types.find((schema) => getTypeFromSchema(schema) === selectedType);

	function handleSelect(event: CustomEvent<string>) {
		selectedType = event.detail;
	}

	async function submit() {
		const data = Object.fromEntries(formData(form));

		const url = selectedDevice ? form.action + selectedDevice : form.action;

		await post(url, {
			...data,
			type: selectedType
		});
	}
</script>

<nav class="tabs is-centered">
	<ul>
		{#each types as schema (schema.properties.type.enum[0])}
			<TypeTab selected={selectedType} {schema} on:click={handleSelect} />
		{/each}
	</ul>
</nav>

<form
	method="post"
	action="/v3/device/state/"
	on:submit|preventDefault={() => {
		loading = submit();
	}}
	bind:this={form}
>
	<Field htmlFor="control-serial" label="Device">
		<div class="select">
			<select bind:value={selectedDevice} id="control-serial">
				<option value="">All devices</option>
				{#each devices as device (device.serial)}
					<option value={device.serial}>
						{device.info.deviceName || device.serial}
					</option>
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
		<p class="control">
			{#await loading}
				<button type="submit" class="button is-primary is-loading">Loading</button>
			{:then _}
				<button type="submit" class="button is-primary">Submit</button>
			{:catch _}
				<button type="submit" class="button is-danger">Submit</button>
			{/await}
		</p>
	</div>
</form>
