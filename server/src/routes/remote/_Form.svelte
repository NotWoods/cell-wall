<script lang="ts">
	export let action: string;
	export let onSubmit: (formData: FormData, action: URL) => Promise<void>;

	let form: HTMLFormElement;
	let loading: Promise<void> = Promise.resolve();

	function handleSubmit() {
		loading = onSubmit(new FormData(form), new URL(action));
	}
</script>

<form method="post" {action} on:submit|preventDefault={handleSubmit} bind:this={form}>
	<slot {loading} />
</form>
