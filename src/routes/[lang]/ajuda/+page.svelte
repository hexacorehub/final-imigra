<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);

	const tel = (phone: string) => phone.replace(/[^\d+]/g, '');
	const isConfirmed = (v: string | null) => Boolean(v && !/a confirmar/i.test(v));
</script>

<svelte:head><title>{m.help.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<div class="stack">
			<h1>{m.help.title}</h1>
			<p class="lead">{m.help.lead}</p>
		</div>

		<section class="notice stack" aria-labelledby="scam">
			<h2 id="scam" class="scam-title"><Icon name="shield" /> {m.help.scamTitle}</h2>
			<ul>
				<li>{m.help.scam1}</li>
				<li>{m.help.scam2}</li>
				<li>{m.help.scam3}</li>
				<li>{m.help.scam4}</li>
			</ul>
		</section>

		<section class="card stack">
			<h2>{m.help.dpuTitle}</h2>
			<p>{m.help.dpuText}</p>
			<p class="small">{m.help.dpeText}</p>
		</section>

		<ul class="places">
			{#each data.locations as l (l.id)}
				<li class="card stack">
					<span class="badge" class:badge-conditional={l.role?.startsWith('Processa')}>
						{l.role?.startsWith('Processa') ? m.help.processes : m.help.guides}
					</span>
					<h3>{l.name}</h3>
					{#if isConfirmed(l.address)}<p>{l.address}</p>{/if}
					{#if isConfirmed(l.hours)}<p class="small">{m.help.hours}: {l.hours}</p>{/if}
					{#if l.services}<p class="small">{l.services}</p>{/if}
					<div class="actions">
						{#if isConfirmed(l.phone) && l.phone}
							<a class="btn btn-ghost" href="tel:{tel(l.phone)}"><Icon name="phone" size={18} /> {m.help.call}</a>
						{/if}
						{#if isConfirmed(l.email) && l.email}
							<a class="btn btn-ghost" href="mailto:{l.email.split(' ')[0]}">{m.help.email}</a>
						{/if}
					</div>
					{#if l.status !== 'Confirmado'}<p class="small">{m.help.toConfirm}</p>{/if}
				</li>
			{/each}
		</ul>
		<p class="small">{m.disclaimer}</p>
	</main>
	<BottomNav {lang} current="help" labels={m.nav} />
</div>

<style>
	.scam-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 1.0625rem;
	}
	.notice ul {
		margin: 0;
		padding-left: 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.places {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.actions .btn {
		min-height: 44px;
		font-size: 0.9375rem;
		flex: 1;
	}
</style>
