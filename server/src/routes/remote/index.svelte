<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { formDataAsSearchParams } from './_form';
	import Form from './_Form.svelte';
	import PresetCard from './_PresetCard.svelte';

	async function submit(data: FormData, action: URL) {
		const res = await fetch(action.toString(), {
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formDataAsSearchParams(data)
		});

		console.log(await res.json());
	}
</script>

<Form action="/api/device/state/preset" onSubmit={submit} let:loading>
	{#await loading}
		<progress class="progress is-small is-primary" max="100">Loading</progress>
	{:then res}
		<progress class="progress is-small is-primary" value={res != undefined ? '100' : '0'} max="100"
			>Done</progress
		>
	{:catch _}
		<progress class="progress is-small is-danger" value="100" max="100">Error</progress>
	{/await}

	<div class="tile is-ancestor">
		<div class="tile is-parent is-vertical">
			<PresetCard title="Info" preset="info">Calendar indicators and the week's weather.</PresetCard
			>
			<PresetCard title="Tea list" preset="tea">What's avaliable to drink?</PresetCard>
		</div>
		<div class="tile is-parent">
			<article class="tile is-child notification">
				<figure class="image">
					<img
						alt=""
						src="https://raw.githubusercontent.com/NotWoods/cell-wall/main/images/finished.jpg"
					/>
				</figure>
				<div class="field">
					<label class="label" for="control-rest">Remaining cells</label>
					<div class="control">
						<div class="select">
							<select id="control-rest" name="rest">
								<option value="ignore">Ignore</option>
								<option value="blank">Blank</option>
								<option value="off">Off</option>
							</select>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</Form>
