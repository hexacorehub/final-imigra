<script lang="ts">
	import { goto } from '$app/navigation';
	import { profile } from '$lib/profile/profile.svelte';
	import { buildPath } from '$lib/engine/path';
	import { countryName } from '$lib/countries';
	import { fmt } from '$lib/i18n';
	import TriageTop from '$lib/components/TriageTop.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);
	const p = $derived(profile.value);
	const result = $derived(buildPath(p, data.rules));

	const situation = $derived(
		[
			p.location === 'abroad' ? m.situation.abroad : m.situation.cityName,
			p.location === 'abroad' ? null : p.brDocument ? m.situation.docs[p.brDocument] : null,
			p.hasCpf === 'yes' ? m.summary.hasCpf : m.summary.noCpf
		]
			.filter(Boolean)
			.join(' · ')
	);
	const goals = $derived(
		p.goals.map((g) => ({ live: m.goals.live, family: m.goals.family, refuge: m.goals.refuge, address: m.goals.address })[g]).join(' · ')
	);

	function finish(e: MouseEvent) {
		e.preventDefault();
		profile.update({ completedAt: new Date().toISOString() });
		goto(`/${lang}/caminho`);
	}
</script>

<svelte:head><title>{m.summary.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<TriageTop step={5} backHref="/{lang}/triagem/objetivo" backLabel={m.back} stepLabel={m.stepOf} />
		<h1>{m.summary.title}</h1>

		<dl class="card summary">
			<div>
				<dt>{m.summary.nationality}</dt>
				<dd>{p.nationality ? countryName(p.nationality, lang) : '—'}</dd>
				<a href="/{lang}/triagem/pais">{m.edit}</a>
			</div>
			<div>
				<dt>{m.summary.situation}</dt>
				<dd>{situation}</dd>
				<a href="/{lang}/triagem/situacao">{m.edit}</a>
			</div>
			<div>
				<dt>{m.summary.goals}</dt>
				<dd>{goals || '—'}</dd>
				<a href="/{lang}/triagem/objetivo">{m.edit}</a>
			</div>
		</dl>

		<h2>{m.summary.pathTitle}</h2>
		{#each result.notices as n}
			<p class="notice">
				{fmt(m.notices[n.kind], n.kind === 'own-modality' ? { modalities: n.modalities ?? '' } : {})}
			</p>
		{/each}
		{#each result.steps as s (s.processId)}
			<div class="card stack" class:card-strong={s.reason === 'residence'}>
				<span class="badge">{m.reasons[s.reason]}</span>
				<h3>{m.procedures[s.processId]}</h3>
			</div>
		{/each}
		<p class="small">{m.summary.notOfficial}</p>
	</main>
	<div class="footer-action">
		<a class="btn" href="/{lang}/caminho" onclick={finish}>{m.summary.build} <Icon name="next" /></a>
	</div>
</div>

<style>
	.summary {
		margin: 0;
		padding: 0;
	}
	.summary div {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 2px 12px;
		padding: 12px 14px;
		border-bottom: 1px solid var(--line-2);
	}
	.summary div:last-child {
		border-bottom: 0;
	}
	dt {
		font-size: 0.8125rem;
		color: var(--ink-2);
		grid-column: 1;
	}
	dd {
		margin: 0;
		font-weight: 700;
		grid-column: 1;
	}
	.summary a {
		grid-column: 2;
		grid-row: 1 / span 2;
		min-height: 44px;
		display: flex;
		align-items: center;
		font-size: 0.875rem;
	}
</style>
