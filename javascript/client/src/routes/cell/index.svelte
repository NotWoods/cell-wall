<script lang="ts">
	import { goto } from '$app/navigation';
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import Form from '$lib/components/Form.svelte';
	import { post } from '../remote/_form';

	let id = '';

	async function submit(formData: FormData, action: URL) {
		const data = Object.fromEntries(formData);

		await post(action.toString(), data);
		goto(`/cell/frame?id=${id}`);
	}
</script>

<svelte:head>
	<title>New Cell | CellWall</title>
	<link rel="stylesheet" href="https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css" />
</svelte:head>

<nav class="navbar">
	<div class="navbar-brand">
		<a class="navbar-item" href="https://github.com/NotWoods/cell-wall">
			<img src="/logo.png" alt="" width="28" height="28" />
			<span style="margin-left: 0.5rem">CellWall</span>
		</a>
	</div>
</nav>

<main class="section">
	<div class="container">
		<Form action="/api/device/{id}" onSubmit={submit} let:loading>
			<VerticalField for="control-id" label="ID" let:inputClassName>
				<input
					id="control-id"
					class={inputClassName}
					name="id"
					type="text"
					required
					bind:value={id}
				/>
			</VerticalField>
			<VerticalField for="control-name" label="Name" let:inputClassName>
				<input id="control-name" class={inputClassName} name="name" type="text" required />
			</VerticalField>

			<div class="field is-grouped is-grouped-right" style="margin-top: 3rem">
				<p class="control">
					<button type="reset" class="button is-light">Reset</button>
				</p>
				<SubmitButton {loading} />
			</div>
		</Form>
	</div>
</main>
