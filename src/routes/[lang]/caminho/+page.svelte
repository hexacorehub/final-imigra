<script lang="ts">
	import { profile } from '$lib/profile/profile.svelte';
	import { buildPath } from '$lib/engine/path';
	import { countryName } from '$lib/countries';
	import { fmt } from '$lib/i18n';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);
	const p = $derived(profile.value);
	const result = $derived(buildPath(p, data.rules));

	// Progress per procedure = documents marked ready / documents listed for it.
	const items = $derived(
		result.steps.map((s) => {
			const docIds = data.summaries.find((x) => x.id === s.processId)?.docIds ?? [];
			const done = docIds.filter((id) => p.ready[id]).length;
			return { ...s, total: docIds.length, done, complete: docIds.length > 0 && done === docIds.length };
		})
	);
	const completeCount = $derived(items.filter((i) => i.complete).length);
	const current = $derived(items.findIndex((i) => !i.complete));

	// Quietly fetch this person's procedure pages so they work offline later
	// (the service worker caches them). Only their own pages, only when idle.
	$effect(() => {
		if (!p.completedAt || !('serviceWorker' in navigator)) return;
		const urls = result.steps.flatMap((s) => [
			`/${lang}/caminho/${s.processId}`,
			`/${lang}/caminho/${s.processId}/__data.json`
		]);
		const idle = (cb: () => void) =>
			'requestIdleCallback' in window ? requestIdleCallback(cb) : setTimeout(cb, 2000);
		idle(() => urls.forEach((u) => fetch(u).catch(() => {})));
	});
</script>

<svelte:head><title>{m.path.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<h1>{m.path.title}</h1>

		{#if !profile.loaded}
			<p class="muted">{m.loading}</p>
		{:else if !p.completedAt}
			<p class="lead">{m.path.empty}</p>
			<a class="btn" href="/{lang}/triagem/pais">{m.path.startTriage} <Icon name="next" /></a>
		{:else}
			<section class="hero" aria-label={m.path.title}>
				<a href="/{lang}/triagem/resumo" class="profile-line">
					{fmt(m.path.profileLine, {
						country: p.nationality ? countryName(p.nationality, lang) : '—',
						city: p.location === 'abroad' ? m.situation.abroad : m.situation.cityName
					})} · {m.edit}
				</a>
				<p class="big">{fmt(m.path.progress, { done: completeCount, total: items.length })}</p>
				<div class="meter" aria-hidden="true">
					<span style="width: {items.length ? Math.max(4, (completeCount / items.length) * 100) : 4}%"></span>
				</div>
			</section>

			{#each result.notices as n}
				<div class="notice stack">
					<p>{fmt(m.notices[n.kind], n.kind === 'own-modality' ? { modalities: n.modalities ?? '' } : {})}</p>
					{#if n.kind !== 'nothing-selected'}
						<a href="/{lang}/ajuda">{m.notices.talkToCrai}</a>
					{/if}
				</div>
			{/each}

			<ol class="steps">
				{#each items as item, i (item.processId)}
					<li>
						<a class="card card-link" class:card-strong={i === current} href="/{lang}/caminho/{item.processId}">
							<span class="num" class:done={item.complete}>
								{#if item.complete}<Icon name="check" size={16} />{:else}{i + 1}{/if}
							</span>
							<span class="grow stack">
								<span class="badge">{m.reasons[item.reason]}</span>
								<strong>{m.procedures[item.processId]}</strong>
								<span class="small">{fmt(m.path.docsReady, { done: item.done, total: item.total })}</span>
							</span>
							<Icon name="chevron" />
						</a>
					</li>
				{/each}
			</ol>

			<a class="small" href="/{lang}/triagem/pais">{m.path.redo}</a>
		{/if}
	</main>
	<BottomNav {lang} current="path" labels={m.nav} />
</div>

<style>
	.hero {
		background: var(--brand);
		color: #fff;
		border-radius: 18px;
		padding: 16px 18px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.profile-line {
		color: #cfe6dd;
		font-size: 0.8125rem;
		text-decoration: none;
	}
	.big {
		font-size: 1.5rem;
		font-weight: 800;
	}
	.meter {
		height: 8px;
		border-radius: 4px;
		background: #2c7565;
	}
	.meter span {
		display: block;
		height: 8px;
		border-radius: 4px;
		background: var(--accent);
	}
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.num {
		width: 28px;
		height: 28px;
		flex-shrink: 0;
		border-radius: 14px;
		border: 2px solid var(--brand);
		color: var(--brand);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.875rem;
	}
	.num.done {
		background: var(--ok);
		border-color: var(--ok);
		color: #fff;
	}
	.grow {
		flex: 1;
		gap: 4px;
	}
</style>
