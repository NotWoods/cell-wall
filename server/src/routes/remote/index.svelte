<script lang="ts">
	import { post } from './_form';
	import PresetCard from './_PresetCard.svelte';

	let loading: Promise<unknown> = Promise.resolve();
	let rest = 'ignore';

	async function onActivate(event: CustomEvent<string>) {
		const action = event.detail;
		loading = post(action, { rest });
	}
</script>

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
		<PresetCard title="Info" action="/v3/device/state/presets/info" on:activate={onActivate}>
			Calendar indicators and the week's weather.
		</PresetCard>
		<PresetCard title="Tea list" action="/v3/device/state/presets/tea" on:activate={onActivate}>
			What's avaliable to drink?
		</PresetCard>
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
						<select id="control-rest" name="rest" bind:value={rest}>
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
