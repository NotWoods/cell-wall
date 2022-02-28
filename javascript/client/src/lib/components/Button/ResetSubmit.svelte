<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import SubmitButton from '$lib/components/Button/SubmitButton.svelte';

	export let loading: Promise<void>;
</script>

<div class="mt-6 ml-auto">
	<Button type="reset">Reset</Button>
	<SubmitButton {loading} />
</div>
