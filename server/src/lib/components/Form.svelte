<script lang="ts">
	export let action: string;
	export let onSubmit: (formData: FormData, action: URL) => Promise<void>;

	let form: HTMLFormElement;
	let loading: Promise<void> = Promise.resolve();

	function handleSubmit(evt: Event) {
		const event = evt as SubmitEvent;
		const formData = new FormData(form);

		const submitter = event.submitter as HTMLButtonElement | HTMLInputElement | null;
		if (submitter && submitter.name) {
			formData.set(submitter.name, submitter.value);
		}
		loading = onSubmit(formData, new URL(form.action));
	}
</script>

<form method="post" {action} on:submit|preventDefault={handleSubmit} bind:this={form}>
	<slot {loading} />
</form>
