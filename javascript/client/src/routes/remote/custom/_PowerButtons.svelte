<script lang="ts" context="module">
	const colors = {
		pending: 'bg-slate-700',
		success: 'bg-slate-700 hover:bg-slate-800'
	};
</script>

<script lang="ts">
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';
	import Form from '$lib/components/Form.svelte';
	import { post } from '../_form';

	const notLoading: Promise<void> = Promise.resolve();

	export let serial: string | undefined;

	async function submit(formData: FormData, action: URL) {
		const data = Object.fromEntries(formData);

		await post(action.toString(), data);
	}
</script>

<Form class="flex" method="post" action="" onSubmit={submit} let:status>
	<legend class="sr-only">Power</legend>
	<SubmitButton
		loading={!status.submitterName ? status.loading : notLoading}
		{colors}
		disabled={serial === undefined}
		class="rounded-r-none"
		formaction="/api/action/launch/{serial}"
		aria-label="Launch client app"
	>
		Launch
	</SubmitButton>
	<SubmitButton
		loading={status.submitterValue === 'false' ? status.loading : notLoading}
		{colors}
		name="on"
		value="false"
		disabled={serial === undefined}
		class="rounded-r-none rounded-l-none border-l border-r border-slate-500"
		formaction="/api/device/power/{serial}"
		aria-label="Power off"
	>
		Off
	</SubmitButton>
	<SubmitButton
		loading={status.submitterValue === 'true' ? status.loading : notLoading}
		{colors}
		name="on"
		value="true"
		disabled={serial === undefined}
		class="rounded-l-none"
		formaction="/api/device/power/{serial}"
		aria-label="Power on"
	>
		On
	</SubmitButton>
</Form>
