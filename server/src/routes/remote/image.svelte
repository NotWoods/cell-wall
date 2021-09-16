<script lang="ts" context="module">
	import { createLoadWithDevices, Props } from './_load';

	export const load = createLoadWithDevices();
</script>

<script lang="ts">
	import Field from './_Field.svelte';
	import Form from './_Form.svelte';
	import DeviceOption from './_DeviceOption.svelte';

	export let devices: Props['devices'];

	let fileName = '';

	async function submit(data: FormData, action: URL) {
		const image = data.get('image') as File;
		data.delete('image');

		for (const [key, value] of data) {
			action.searchParams.append(key, value as string);
		}

		try {
			const res = await fetch(action.toString(), {
				method: 'post',
				headers: {
					'content-type': image.type
				},
				body: image
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

<Form action="/v3/action/image" onSubmit={submit} let:loading>
	<Field htmlFor="control-image" label="Image">
		<div class="file has-name">
			<label class="file-label">
				<input
					class="file-input"
					type="file"
					required
					accept="image/*"
					name="image"
					on:change={(evt) => {
						fileName = evt.currentTarget.files?.[0]?.name || '';
					}}
				/>
				<span class="file-cta">
					<span class="file-icon">
						<svg width="24" height="24" viewBox="4 3 18 17" style="fill: currentColor">
							<path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
						</svg>
					</span>
					<span class="file-label"> Choose a file… </span>
				</span>
				<span class="file-name"> {fileName} </span>
			</label>
		</div>
	</Field>

	<Field htmlFor="control-serial" label="Devices">
		<div class="select is-multiple">
			<select multiple name="device" id="control-serial">
				{#each devices as device (device.serial)}
					<DeviceOption {device} />
				{/each}
			</select>
		</div>
	</Field>

	<Field htmlFor="control-hozalign" label="Horizontal Alignment">
		<div class="select">
			<select id="control-hozalign" name="horizontalAlign">
				<option value="center">Center</option>
				<option value="left">Left</option>
				<option value="right">Right</option>
			</select>
		</div>
	</Field>

	<Field htmlFor="control-veralign" label="Vertical Alignment">
		<div class="select">
			<select id="control-veralign" name="verticalAlign">
				<option value="middle">Middle</option>
				<option value="top">Top</option>
				<option value="bottom">Bottom</option>
			</select>
		</div>
	</Field>

	<Field htmlFor="control-resize" label="Resize Mode">
		<div class="select">
			<select id="control-resize" name="resize">
				<option value="bilinearInterpolation">Bilinear</option>
				<option value="bicubicInterpolation">Bicubic</option>
				<option value="hermiteInterpolation">Hermite</option>
				<option value="bezierInterpolation">Bezier</option>
				<option value="nearestNeighbor">Nearest Neighbor</option>
			</select>
		</div>
	</Field>

	<Field htmlFor="control-rest" label="Remaining Cells">
		<div class="select">
			<select id="control-rest" name="rest">
				<option value="ignore">Ignore</option>
				<option value="blank">Blank</option>
				<option value="off">Off</option>
			</select>
		</div>
	</Field>

	<div class="field is-grouped is-grouped-right" style="margin-top: 3rem">
		<p class="control">
			<button type="reset" class="button is-light">Reset</button>
		</p>
		<p class="control">
			{#await loading}
				<button type="submit" class="button is-primary is-loading">Loading</button>
			{:then _}
				<button type="submit" class="button is-primary">Submit</button>
			{:catch _}
				<button type="submit" class="button is-danger">Submit</button>
			{/await}
		</p>
	</div>
</Form>
