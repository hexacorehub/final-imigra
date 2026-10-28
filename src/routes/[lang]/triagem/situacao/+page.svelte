<script lang="ts">
	import { profile } from '$lib/profile/profile.svelte';
	import type { BrDocument, HasCpf, Location } from '$lib/profile/types';
	import TriageTop from '$lib/components/TriageTop.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);
	const p = $derived(profile.value);

	const docs: BrDocument[] = ['none', 'protocol', 'dprnm', 'crnm', 'visa', 'dou', 'unknown'];
	const cpfOptions = $derived<[HasCpf, string][]>([
		['yes', m.situation.cpfYes],
		['no', m.situation.cpfNo],
		['unknown', m.situation.cpfUnknown]
	]);
	const whereOptions = $derived<[Location, string][]>([
		['br', m.situation.inBrazil],
		['abroad', m.situation.abroad]
	]);

	const setLocation = (location: Location) =>
		profile.update({ location, city: location === 'br' ? 'sao-paulo' : null });

	const complete = $derived(Boolean(p.location && p.hasCpf && (p.location === 'abroad' || p.brDocument)));
</script>

<svelte:head><title>{m.situation.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<TriageTop step={3} backHref="/{lang}/triagem/pais" backLabel={m.back} stepLabel={m.stepOf} />
		<h1>{m.situation.title}</h1>

		<fieldset class="choices row">
			<legend>{m.situation.whereTitle}</legend>
			{#each whereOptions as [value, label] (value)}
				<label class="choice" class:on={p.location === value}>
					<input type="radio" name="where" {value} checked={p.location === value} onchange={() => setLocation(value)} />
					{label}
				</label>
			{/each}
		</fieldset>
		{#if p.location === 'br'}
			<p class="muted">{m.situation.city}: <strong>{m.situation.cityName}</strong>. {m.situation.cityNote}</p>
		{/if}

		<fieldset class="choices row">
			<legend>{m.situation.cpfTitle}</legend>
			{#each cpfOptions as [value, label] (value)}
				<label class="choice" class:on={p.hasCpf === value}>
					<input type="radio" name="cpf" {value} checked={p.hasCpf === value} onchange={() => profile.update({ hasCpf: value })} />
					{label}
				</label>
			{/each}
		</fieldset>
		{#if p.hasCpf === 'unknown'}
			<div class="card stack" role="note">
				<h2>{m.situation.cpfInfoTitle}</h2>
				{#each data.cpfInfo as text}<p>{text}</p>{/each}
				{#if m.contentInPortuguese}<p class="small">{m.contentInPortuguese}</p>{/if}
				<p><strong>{m.situation.cpfAdded}</strong></p>
			</div>
		{:else if p.hasCpf === 'no'}
			<p class="notice notice-info">{m.situation.cpfAdded}</p>
		{/if}

		{#if p.location !== 'abroad'}
			<fieldset class="choices">
				<legend>{m.situation.docTitle}</legend>
				{#each docs as value (value)}
					<label class="choice" class:on={p.brDocument === value}>
						<input
							type="radio"
							name="doc"
							{value}
							checked={p.brDocument === value}
							onchange={() => profile.update({ brDocument: value })}
						/>
						{m.situation.docs[value]}
					</label>
				{/each}
			</fieldset>
		{/if}
	</main>
	<div class="footer-action">
		<a class="btn" href="/{lang}/triagem/objetivo" aria-disabled={!complete}>{m.continue} <Icon name="next" /></a>
	</div>
</div>
