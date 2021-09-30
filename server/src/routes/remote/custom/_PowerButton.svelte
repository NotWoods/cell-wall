<script lang="ts">
	import { post } from '../_form';

	export let serial: string;
	export let value: boolean;

	const props = {
		type: 'button',
		name: 'on',
		value: value.toString()
	};

	let loading: Promise<void> = Promise.resolve();

	function handleClick() {
		loading = setPower();
	}

	async function setPower() {
		await post(`/api/device/power/${serial}`, {
			on: value
		});
	}
</script>

{#await loading}
	<button
		{...props}
		type="submit"
		formaction="/api/device/power/${serial}"
		class="button is-loading"
		on:click={handleClick}
	>
		<slot />
	</button>
{:then _}
	<button
		{...props}
		type="submit"
		formaction="/api/device/power/${serial}"
		class="button"
		on:click={handleClick}
	>
		<slot />
	</button>
{:catch _}
	<button
		{...props}
		type="submit"
		formaction="/api/device/power/${serial}"
		class="button is-danger"
		on:click={handleClick}
	>
		<slot />
	</button>
{/await}
