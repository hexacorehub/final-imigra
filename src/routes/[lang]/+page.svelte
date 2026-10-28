<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { profile } from '$lib/profile/profile.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);

	// Someone who already finished the triage goes straight to their path.
	onMount(() => {
		if (profile.value.completedAt) goto(`/${data.lang}/caminho`, { replaceState: true });
	});
</script>

<svelte:head>
	<title>Rumo</title>
</svelte:head>

<div class="page">
	<AppHeader lang={data.lang} label={m.languageLabel} />
	<main class="content">
		<h1>{m.tagline}</h1>
		<p class="lead">{m.privacy} {m.offlineReady}</p>
		<a class="btn" href="/{data.lang}/triagem/pais">{m.start} <Icon name="next" /></a>
		<div class="stack">
			<a class="btn btn-ghost" href="/{data.lang}/cidade">{m.nav.city}</a>
			<a class="btn btn-ghost" href="/{data.lang}/ajuda">{m.nav.help}</a>
		</div>
		<p class="small">{m.disclaimer}</p>
	</main>
</div>
