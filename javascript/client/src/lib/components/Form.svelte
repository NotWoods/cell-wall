<script lang="ts" context="module">
	export interface FormSubmitStatus {
		loading: Promise<void>;
		submitterName: string;
		submitterValue: string;
	}
</script>

<script lang="ts">
	let className = '';
	export { className as class };

	export let action: string;
	export let onSubmit: (formData: FormData, action: URL) => Promise<void>;

	let form: HTMLFormElement;
	let status: FormSubmitStatus = {
		loading: Promise.resolve(),
		submitterName: '',
		submitterValue: ''
	};

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
		status = {
			loading: onSubmit(formData, new URL(action)),
			submitterName: submitter?.name ?? '',
			submitterValue: submitter?.value ?? ''
		};
	}
</script>

<form
	class={className}
	method="post"
	{action}
	on:submit|preventDefault={handleSubmit}
	bind:this={form}
>
	<slot {status} />
</form>
