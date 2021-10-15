<script lang="ts">
	export let action: string;
	export let onSubmit: (formData: FormData, action: URL) => Promise<void>;

	let form: HTMLFormElement;
	let loading: Promise<void> = Promise.resolve();

	function handleSubmit(evt: Event) {
		const event = evt as SubmitEvent;
		const formData = new FormData(form);

		const submitter = event.submitter as HTMLButtonElement | HTMLInputElement | null;
		let action = form.action;
		if (submitter && submitter.name) {
			formData.set(submitter.name, submitter.value);
			if (submitter.hasAttribute('formaction')) {
				action = submitter.formAction;
			}
		}
		loading = onSubmit(formData, new URL(action));
	}
</script>

<form method="post" {action} on:submit|preventDefault={handleSubmit} bind:this={form}>
	<slot {loading} />
</form>
