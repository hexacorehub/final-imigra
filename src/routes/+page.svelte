<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { locales, localeNames, preferredLocale, isLocale } from '$lib/i18n';
	import Icon from '$lib/components/Icon.svelte';

	// Step 1 of the triage: language. A returning visitor goes straight to their language.
	let suggested = $state<string>('pt');

	onMount(() => {
		try {
			const saved = localStorage.getItem('rumo:locale');
			if (isLocale(saved)) {
				goto(`/${saved}`, { replaceState: true });
				return;
			}
		} catch {
			/* storage blocked: just show the picker */
		}
		suggested = preferredLocale(navigator.languages ?? [navigator.language]);
	});

	function remember(lang: string) {
		try {
			localStorage.setItem('rumo:locale', lang);
		} catch {
			/* ignore */
		}
	}
</script>

<svelte:head>
	<title>Rumo</title>
</svelte:head>

<main class="page">
	<div class="content">
		<div class="brand">
			<span class="logo"><Icon name="route" size={24} /></span>
			<span>Rumo</span>
		</div>
		<h1>Escolha seu idioma<br /><span class="alt">Elige tu idioma</span></h1>
		<div class="stack">
			{#each locales as lang (lang)}
				<a
					class="btn"
					class:btn-ghost={lang !== suggested}
					href="/{lang}"
					hreflang={lang}
					onclick={() => remember(lang)}>{localeNames[lang]}</a
				>
			{/each}
		</div>
		<p class="small">English, Français e Kreyòl: em breve / pronto.</p>
	</div>
</main>

<style>
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 800;
		font-size: 1.5rem;
	}
	.logo {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--brand);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.alt {
		color: var(--ink-2);
		font-weight: 700;
		font-size: 1.25rem;
	}
</style>
