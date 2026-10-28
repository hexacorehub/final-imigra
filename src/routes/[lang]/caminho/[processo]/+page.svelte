<script lang="ts">
	import { profile } from '$lib/profile/profile.svelte';
	import { fmt } from '$lib/i18n';
	import type { KbDocument } from '$lib/kb/types';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);
	const b = $derived(data.bundle);
	const proc = $derived(b.procedure);

	// Group documents by the moment they are presented (online request, at the PF…).
	const groups = $derived.by(() => {
		const map = new Map<string, KbDocument[]>();
		for (const d of b.documents) {
			const k = d.stage ?? '—';
			map.set(k, [...(map.get(k) ?? []), d]);
		}
		return [...map.entries()];
	});

	const officialUrl = $derived(
		b.sources.find((s) => proc.sources.includes(s.id) && s.type.startsWith('Oficial') && s.access === 'Acessível')?.url ??
			b.sources.find((s) => s.type.startsWith('Oficial'))?.url
	);
	const ready = (id: string) => Boolean(profile.value.ready[id]);
</script>

<svelte:head><title>{m.procedures[proc.id] ?? proc.name} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<a class="small" href="/{lang}/caminho">← {m.procedure.backToPath}</a>
		<div class="stack">
			<h1>{m.procedures[proc.id] ?? proc.name}</h1>
			<p class="muted">{proc.authority}</p>
		</div>
		{#if m.contentInPortuguese}<p class="notice notice-info">{m.contentInPortuguese}</p>{/if}

		{#if b.explanations.length}
			<details class="card" open>
				<summary>{m.procedure.whatIsIt}</summary>
				<div class="stack">
					{#each b.explanations as e (e.id)}<p>{e.text}</p>{/each}
				</div>
			</details>
		{/if}

		<dl class="facts card">
			{#if proc.eligibility}<dt>{m.procedure.whoCanApply}</dt><dd>{proc.eligibility}</dd>{/if}
			{#if proc.channel}<dt>{m.procedure.where}</dt><dd>{proc.channel}</dd>{/if}
			{#if proc.cost}<dt>{m.procedure.cost}</dt><dd>{proc.cost}</dd>{/if}
			{#if proc.timing}<dt>{m.procedure.timing}</dt><dd>{proc.timing}</dd>{/if}
			{#if proc.legalBasis}<dt>{m.procedure.legalBasis}</dt><dd>{proc.legalBasis}</dd>{/if}
		</dl>

		{#if b.documents.length}
			<section class="stack">
				<h2>{m.procedure.documents}</h2>
				{#each groups as [stage, docs] (stage)}
					<h3 class="stage">{m.procedure.stage}: {stage}</h3>
					<ul class="docs">
						{#each docs as d (d.id)}
							<li class="card doc" class:is-ready={ready(d.id)}>
								<label class="row">
									<input type="checkbox" checked={ready(d.id)} onchange={() => profile.toggleReady(d.id)} />
									<span class="grow">
										<span class="name">{d.name}</span>
										<span class="sr-only">{ready(d.id) ? m.procedure.ready : m.procedure.markReady}</span>
									</span>
								</label>
								<StatusBadge status={d.status} label={m.status[d.status]} />
								{#if d.condition}<p class="small"><strong>{m.procedure.condition}:</strong> {d.condition}</p>{/if}
								{#if d.status === 'unconfirmed'}
									<p class="small">
										{m.procedure.unconfirmedHelp}
										{#if officialUrl}<a href={officialUrl} rel="noopener" target="_blank">{m.procedure.officialChannel}</a>{/if}
									</p>
								{/if}
								{#if d.alternatives || d.howToGet || d.formalities}
									<details>
										<summary>{m.procedure.howToGet}</summary>
										<dl class="more">
											{#if d.howToGet}<dt>{m.procedure.howToGet}</dt><dd>{d.howToGet}</dd>{/if}
											{#if d.alternatives}<dt>{m.procedure.alternatives}</dt><dd>{d.alternatives}</dd>{/if}
											{#if d.formalities}<dt>{m.procedure.formalities}</dt><dd>{d.formalities}</dd>{/if}
										</dl>
									</details>
								{/if}
							</li>
						{/each}
					</ul>
				{/each}
			</section>
		{/if}

		{#if b.steps.length}
			<section class="stack">
				<h2>{m.procedure.steps}</h2>
				<ol class="howto">
					{#each b.steps as s (s.order)}
						<li>
							<p>{s.text}</p>
							{#if s.time || s.cost}<p class="small">{[s.time, s.cost].filter(Boolean).join(' · ')}</p>{/if}
							{#if s.link}
								<a href={s.link} rel="noopener" target="_blank">{m.procedure.officialChannel} <Icon name="external" size={14} /></a>
							{/if}
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		<section class="stack sources">
			<h2>{m.procedure.sources}</h2>
			<ul>
				{#each b.sources as s (s.id)}
					<li>
						<a href={s.url} rel="noopener" target="_blank">{s.authority}: {s.title}</a>
						{#if s.access?.startsWith('Restrita')}<span class="small"> ({m.procedure.restricted})</span>{/if}
						{#if s.type.startsWith('Secundária')}<span class="small"> ({m.procedure.secondary})</span>{/if}
					</li>
				{/each}
			</ul>
			{#if proc.verifiedAt}<p class="small">{fmt(m.procedure.verifiedAt, { date: proc.verifiedAt })}</p>{/if}
			<p class="small">{m.disclaimer}</p>
		</section>
	</main>
	<BottomNav {lang} current="path" labels={m.nav} />
</div>

<style>
	.facts {
		margin: 0;
		display: grid;
		gap: 4px;
	}
	.facts dt {
		font-size: 0.8125rem;
		color: var(--ink-2);
		margin-top: 6px;
	}
	.facts dd {
		margin: 0;
	}
	.stage {
		margin-top: 8px;
		font-size: 0.875rem;
		color: var(--ink-2);
	}
	.docs,
	.sources ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.doc {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.doc.is-ready {
		background: var(--brand-tint);
	}
	.row {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		cursor: pointer;
		min-height: 44px;
	}
	.row input {
		width: 24px;
		height: 24px;
		margin: 0;
		flex-shrink: 0;
		accent-color: var(--brand);
	}
	.name {
		font-weight: 700;
	}
	.grow {
		flex: 1;
	}
	.more {
		margin: 0;
	}
	.more dt {
		font-size: 0.8125rem;
		color: var(--ink-2);
		margin-top: 6px;
	}
	.more dd {
		margin: 0;
	}
	.howto {
		margin: 0;
		padding-left: 22px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.howto a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: 44px;
	}
	.sources a {
		font-weight: 600;
		word-break: break-word;
	}
</style>
