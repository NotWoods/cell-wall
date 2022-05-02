<script lang="ts">
	export let time: number | import('@js-temporal/polyfill').Intl.Formattable;
	export let timeZone: string | undefined = undefined;

	$: formatter = new Intl.DateTimeFormat(undefined, {
		timeStyle: 'short',
		timeZone
	});
	$: timeParts = formatter.formatToParts(time as any);
</script>

{#each timeParts as part}
	<span class={part.type}>{part.value}</span>
{/each}

<style>
	.dayPeriod {
		font-size: 0.5em;
	}
</style>
