<script lang="ts" context="module">
	const colors = {
		pending: 'bg-slate-700',
		success: 'bg-slate-700 hover:bg-slate-800'
	};
</script>

<script lang="ts">
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';
	import { post } from '../_form';

	const name = 'on';
	const notLoading: Promise<void> = Promise.resolve();

	export let serial: string | undefined;

	let loading: Promise<void> = Promise.resolve();
	let submitter = '';

	$: formAction = `/api/device/power/${serial}`;

	async function handlePowerClick(event: Event) {
		const target = event.target as HTMLButtonElement;
		await post(formAction, {
			on: target.value
		});
	}
</script>

<fieldset class="flex" {name}>
	<legend class="sr-only">Power</legend>
	<SubmitButton
		loading={submitter === 'false' ? loading : notLoading}
		{colors}
		{name}
		value="false"
		disabled={serial === undefined}
		class="rounded-r-none border-r border-slate-500"
		formaction={formAction}
		on:click={handlePowerClick}
		aria-label="Power off"
	>
		Off
	</SubmitButton>
	<SubmitButton
		loading={submitter === 'true' ? loading : notLoading}
		{colors}
		{name}
		value="true"
		disabled={serial === undefined}
		class="rounded-l-none"
		formaction={formAction}
		on:click={handlePowerClick}
		aria-label="Power on"
	>
		On
	</SubmitButton>
</fieldset>
