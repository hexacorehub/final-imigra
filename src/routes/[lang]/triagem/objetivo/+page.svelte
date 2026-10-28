<script lang="ts">
	import { profile } from '$lib/profile/profile.svelte';
	import type { Goal } from '$lib/profile/types';
	import TriageTop from '$lib/components/TriageTop.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);

	const options = $derived<{ id: Goal; label: string; hint: string }[]>([
		{ id: 'live', label: m.goals.live, hint: m.goals.liveHint },
		{ id: 'family', label: m.goals.family, hint: m.goals.familyHint },
		{ id: 'refuge', label: m.goals.refuge, hint: m.goals.refugeHint },
		{ id: 'address', label: m.goals.address, hint: m.goals.addressHint }
	]);

	function toggle(id: Goal) {
		const goals = profile.value.goals.includes(id)
			? profile.value.goals.filter((g) => g !== id)
			: [...profile.value.goals, id];
		profile.update({ goals });
	}
</script>

<svelte:head><title>{m.goals.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<TriageTop step={4} backHref="/{lang}/triagem/situacao" backLabel={m.back} stepLabel={m.stepOf} />
		<div class="stack">
			<h1>{m.goals.title}</h1>
			<p class="lead">{m.goals.lead}</p>
		</div>
		<fieldset class="choices">
			<legend class="sr-only">{m.goals.title}</legend>
			{#each options as o (o.id)}
				{@const on = profile.value.goals.includes(o.id)}
				<label class="choice" class:on>
					<input type="checkbox" value={o.id} checked={on} onchange={() => toggle(o.id)} />
					<span>{o.label}<span class="hint">{o.hint}</span></span>
				</label>
			{/each}
		</fieldset>
	</main>
	<div class="footer-action">
		<a class="btn" href="/{lang}/triagem/resumo">{m.goals.seeSummary} <Icon name="next" /></a>
	</div>
</div>
