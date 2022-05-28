<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Form from '$lib/components/Form.svelte';
	import VerticalField from '$lib/components/Field/VerticalField.svelte';
	import { formDataAsSearchParams } from './_form';
	import PresetCard from './_PresetCard.svelte';
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';
	import LinkButton from '$lib/components/Button/LinkButton.svelte';

	async function submit(data: FormData, action: URL) {
		const res = await fetch(action.toString(), {
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formDataAsSearchParams(data)
		});

		const result = await res.json();
		console.log(result);
	}
</script>

<Form
	class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
	action="/api/device/preset"
	onSubmit={submit}
	let:status
>
	<Card class="row-span-2">
		<h2 class="text-3xl mb-4">Presets</h2>
		<VerticalField label="Remaining cells" for="control-rest" let:inputClassName>
			<select id="control-rest" name="rest" class="{inputClassName} cursor-pointer">
				<option value="ignore">Ignore</option>
				<option value="blank">Blank</option>
				<option value="off">Off</option>
			</select>
		</VerticalField>
		<img
			class="block mt-4 shadow-inner rounded"
			alt=""
			src="https://raw.githubusercontent.com/NotWoods/cell-wall/main/images/finished.jpg"
		/>
	</Card>

	<PresetCard title="Info" preset="info" large {status}>
		Calendar indicators and the week's weather.
	</PresetCard>
	<PresetCard title="Tea list" preset="tea" large {status}>What's avaliable to drink?</PresetCard>
	<PresetCard title="JSConf" preset="jsconfbp" large {status}>Hello conference demo</PresetCard>
	<PresetCard title="Actions" button="Launch on devices" formAction="/api/action/launch/" {status}>
		<LinkButton href="/remote/third_party">SDK Login</LinkButton>
		<SubmitButton
			name="action"
			value="install"
			loading={status.submitterName === 'action' && status.submitterValue === 'install'
				? status.loading
				: Promise.resolve()}
			formaction="/api/action/install">Install</SubmitButton
		>
	</PresetCard>
</Form>
