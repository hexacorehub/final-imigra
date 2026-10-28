<script lang="ts">
	import { page } from '$app/state';
	import { locales, localeNames, type Locale } from '$lib/i18n';
	import Icon from './Icon.svelte';

	let { lang, label }: { lang: Locale; label: string } = $props();

	// Link to the same page in the next language.
	const other = $derived(locales.find((l) => l !== lang) ?? lang);
	const switchHref = $derived(page.url.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${other}`));
</script>

<header class="bar">
	<a class="brand" href="/{lang}" aria-label="Rumo">
		<span class="logo"><Icon name="route" size={18} /></span>
		<span>Rumo</span>
	</a>
	<a class="lang" href={switchHref} hreflang={other} data-sveltekit-preload-data="off">
		<Icon name="globe" size={16} />
		<span class="sr-only">{label}:</span>
		{localeNames[other]}
	</a>
</header>

<style>
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px 0;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 800;
		font-size: 1.25rem;
		color: var(--ink);
		text-decoration: none;
		min-height: 44px;
	}
	.logo {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: var(--brand);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lang {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 12px;
		border: 1px solid #c9d3ce;
		border-radius: 20px;
		background: var(--card);
		color: var(--ink);
		font-size: 0.875rem;
		text-decoration: none;
	}
</style>
