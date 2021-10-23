<script lang="ts">
	export let label: string;
	export let htmlFor: string | undefined = undefined;
	export let narrow = false;
</script>

<div class="field is-horizontal">
	<div class="field-label is-normal">
		<label class="label" for={htmlFor}>{label}</label>
	</div>
	<div class="field-body">
		<div class="field" class:is-narrow={narrow}>
			<div class="control">
				<slot />
			</div>
		</div>
	</div>
</div>
