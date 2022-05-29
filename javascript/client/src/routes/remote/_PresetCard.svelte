<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { FormSubmitStatus } from '$lib/components/Form.svelte';
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';

	export let title: string;
	export let preset: string | undefined = undefined;
	export let formAction: string = '/api/device/preset';
	export let large = false;
	export let button = 'Activate';

	export let status: FormSubmitStatus;
	$: selfStatus =
		status.submitterName === 'preset' && status.submitterValue === preset
			? status.loading
			: Promise.resolve();
</script>

<Card class="flex flex-col gap-y-4">
	<h3 class:text-2xl={large} class:text-xl={!large}>{title}</h3>
	<div class="">
		<slot />
	</div>
	<SubmitButton
		class="mt-auto self-end"
		loading={selfStatus}
		name="preset"
		value={preset}
		formaction={formAction}
	>
		{button}
	</SubmitButton>
</Card>
