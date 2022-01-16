<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import ResetSubmit from './_ResetSubmit.svelte';

	async function submit(data: FormData, action: URL) {
		try {
			const res = await fetch(action.toString(), {
				method: 'post',
				headers: {
					'content-type': 'text/plain'
				},
				body: data.get('text')
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
</script>

<Form class="flex flex-col gap-y-4" action="/api/action/text" onSubmit={submit} let:loading>
	<VerticalField for="control-text" label="Text" let:inputClassName>
		<textarea
			class={inputClassName}
			required
			id="control-text"
			name="text"
			rows="10"
			placeholder=" Apple &#13;&#10;Banana &#13;&#10;Carrot"
		/>
	</VerticalField>

	<ResetSubmit {loading} />
</Form>
