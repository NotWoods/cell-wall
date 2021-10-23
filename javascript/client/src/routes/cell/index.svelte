<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import Field from '$lib/components/Field.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { post } from '../remote/_form';

	let id: string = '';

	async function submit(formData: FormData, action: URL) {
		const data = Object.fromEntries(formData);

		await post(action.toString(), data);

		window.location.pathname = `/cell/frame?id=${id}`;
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
			<Field htmlFor="control-id" label="ID">
				<input id="control-id" class="input" name="id" type="text" required bind:value={id} />
			</Field>
			<Field htmlFor="control-name" label="Name">
				<input id="control-name" class="input" name="name" type="text" required />
			</Field>

			<div class="field is-grouped is-grouped-right" style="margin-top: 3rem">
				<p class="control">
					<button type="reset" class="button is-light">Reset</button>
				</p>
				<SubmitButton {loading} />
			</div>
		</Form>
	</div>
</main>
