<script lang="ts">
	import { navigating } from '$app/stores';
</script>

{#if $navigating != null}
	<div
		class="absolute w-full h-1 bg-green-900 overflow-hidden"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={1}
		aria-valuetext="Loading {$navigating?.to?.url.pathname}"
	>
		<div class="progress-bar-value w-full h-full bg-gray-200" />
	</div>
{/if}

<style>
	.progress-bar-value {
		transform-origin: 0% 50%;
		animation: indeterminateAnimation 1s infinite linear;
	}

	@keyframes indeterminateAnimation {
		0% {
			transform: translateX(0) scaleX(0);
		}
		40% {
			transform: translateX(0) scaleX(0.4);
		}
		100% {
			transform: translateX(100%) scaleX(0.5);
		}
	}
</style>
