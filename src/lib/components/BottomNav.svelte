<script lang="ts">
	import Icon from './Icon.svelte';

	let {
		lang,
		current,
		labels
	}: {
		lang: string;
		current: 'path' | 'city' | 'help';
		labels: { path: string; city: string; help: string };
	} = $props();

	const items = [
		{ id: 'path', href: 'caminho', icon: 'route' },
		{ id: 'city', href: 'cidade', icon: 'pin' },
		{ id: 'help', href: 'ajuda', icon: 'help' }
	] as const;
</script>

<nav aria-label="Rumo">
	{#each items as item (item.id)}
		<a href="/{lang}/{item.href}" aria-current={current === item.id ? 'page' : undefined}>
			<Icon name={item.icon} size={22} />
			{labels[item.id]}
		</a>
	{/each}
</nav>

<style>
	nav {
		position: sticky;
		bottom: 0;
		display: flex;
		background: var(--card);
		border-top: 1px solid var(--line-2);
		padding-bottom: env(safe-area-inset-bottom);
	}
	a {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		min-height: 60px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ink-3);
		text-decoration: none;
	}
	a[aria-current='page'] {
		color: var(--brand);
		font-weight: 800;
	}
</style>
