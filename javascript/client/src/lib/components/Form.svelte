<script lang="ts" context="module">
	export interface FormSubmitStatus {
		loading: Promise<void>;
		submitterName: string;
		submitterValue: string;
	}
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { SnackbarDuration, SnackbarHostState } from './snackbar/snackbar-host';

	const snackbarHostState = getContext(SnackbarHostState) as SnackbarHostState;

	export let action: string;
	export let onSubmit: (formData: FormData, action: URL) => Promise<void>;

	let form: HTMLFormElement;
	let status: FormSubmitStatus = {
		loading: Promise.resolve(),
		submitterName: '',
		submitterValue: ''
	};

	function handleSubmit(event: SubmitEvent) {
		const formData = new FormData(form);

		const submitter = event.submitter as HTMLButtonElement | HTMLInputElement | null;
		let action = form.action;
		if (submitter && submitter.name) {
			formData.set(submitter.name, submitter.value);
			action = submitter.formAction;
		}

		status = {
			loading: onSubmit(formData, new URL(action)),
			submitterName: submitter?.name ?? '',
			submitterValue: submitter?.value ?? ''
		};
		status.loading.catch((err: unknown) => {
			const message = err instanceof Error ? err.message : err;
			snackbarHostState.showSnackbar(`Error submitting form: ${message}`, SnackbarDuration.LONG);
		});
	}
</script>

<form
	method="post"
	{...$$restProps}
	{action}
	on:submit|preventDefault={handleSubmit}
	bind:this={form}
>
	<slot {status} loading={status.loading} />
</form>
