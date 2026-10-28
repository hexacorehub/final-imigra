<script lang="ts">
	import { profile } from '$lib/profile/profile.svelte';
	import { ISO_CODES, POPULAR, countryName, normalize } from '$lib/countries';
	import TriageTop from '$lib/components/TriageTop.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);

	let query = $state('');
	let showAll = $state(false);

	const groupOf = (iso: string) => data.rules.find((r) => r.iso === iso)?.group ?? null;

	// Names are computed once per language; ~200 short strings.
	const all = $derived(
		ISO_CODES.map((iso) => ({ iso, name: countryName(iso, lang) })).sort((a, b) =>
			a.name.localeCompare(b.name, lang)
		)
	);

	// Keep the list short on slow phones: popular first, the rest only on search or on demand.
	const visible = $derived.by(() => {
		const q = normalize(query);
		if (q) return all.filter((c) => normalize(c.name).includes(q) || c.iso.toLowerCase() === q).slice(0, 30);
		if (showAll) return all;
		const chosen = profile.value.nationality;
		const ids = chosen && !POPULAR.includes(chosen) ? [chosen, ...POPULAR] : POPULAR;
		return ids.map((iso) => ({ iso, name: countryName(iso, lang) }));
	});

	const choose = (iso: string) => profile.update({ nationality: iso });
</script>

<svelte:head><title>{m.country.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<TriageTop step={2} backHref="/{lang}" backLabel={m.back} stepLabel={m.stepOf} />
		<div class="stack">
			<h1>{m.country.title}</h1>
			<p class="lead">{m.country.lead}</p>
		</div>

		<div class="field">
			<label for="q">{m.country.search}</label>
			<input id="q" class="input" type="search" autocomplete="off" placeholder={m.country.searchPlaceholder} bind:value={query} />
		</div>

		<fieldset class="choices">
			<legend>{query ? m.country.results : showAll ? m.country.showAll : m.country.popular}</legend>
			{#each visible as c (c.iso)}
				{@const group = groupOf(c.iso)}
				<label class="choice" class:on={profile.value.nationality === c.iso}>
					<input
						type="radio"
						name="country"
						value={c.iso}
						checked={profile.value.nationality === c.iso}
						onchange={() => choose(c.iso)}
					/>
					<span class="grow">{c.name}</span>
					{#if group}<span class="badge">{m.country.groups[group] ?? group}</span>{/if}
				</label>
			{:else}
				<p class="muted">{m.country.noResults}</p>
			{/each}
		</fieldset>

		{#if !query && !showAll}
			<button class="btn btn-ghost" type="button" onclick={() => (showAll = true)}>{m.country.showAll}</button>
		{/if}
	</main>
	<div class="footer-action">
		<a class="btn" href="/{lang}/triagem/situacao" aria-disabled={!profile.value.nationality}>
			{m.continue} <Icon name="next" />
		</a>
	</div>
</div>

<style>
	.grow {
		flex: 1;
	}
</style>
