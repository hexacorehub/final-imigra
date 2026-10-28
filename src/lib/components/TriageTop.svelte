<script lang="ts">
	import { fmt } from '$lib/i18n';
	import Icon from './Icon.svelte';

	let {
		step,
		total = 5,
		backHref,
		backLabel,
		stepLabel
	}: { step: number; total?: number; backHref: string; backLabel: string; stepLabel: string } = $props();
</script>

<div class="top">
	<a class="back" href={backHref} aria-label={backLabel}><Icon name="back" size={22} /></a>
	<span class="count">{fmt(stepLabel, { n: step, total })}</span>
</div>
<div class="bar" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={fmt(stepLabel, { n: step, total })}>
	{#each { length: total }, i}
		<span class:on={i < step}></span>
	{/each}
</div>

<style>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.back {
		width: 44px;
		height: 44px;
		margin-left: -10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ink);
	}
	.count {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ink-2);
	}
	.bar {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 6px;
	}
	.bar span {
		height: 6px;
		border-radius: 3px;
		background: var(--line);
	}
	.bar span.on {
		background: var(--brand);
	}
</style>
