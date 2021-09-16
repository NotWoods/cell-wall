<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import PresetCard from './_PresetCard.svelte';

	let rest: 'ignore' | 'blank' | 'off' = 'ignore';
</script>

<div class="tile is-ancestor">
	<div class="tile is-parent is-vertical">
		<PresetCard title="Info" action="/v3/device/state/presets/info" {rest}>
			Calendar indicators and the week's weather.
		</PresetCard>
		<PresetCard title="Tea list" action="/v3/device/state/presets/tea" {rest}>
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
