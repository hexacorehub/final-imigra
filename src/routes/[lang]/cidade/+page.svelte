<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const m = $derived(data.m);
	const lang = $derived(data.lang);

	const levels = $derived([
		{ tag: 'UBS', cls: 'b', title: m.city.ubs, text: m.city.ubsText },
		{ tag: 'UPA', cls: 'w', title: m.city.upa, text: m.city.upaText },
		{ tag: 'PS', cls: 'r', title: m.city.hospital, text: m.city.hospitalText }
	]);
	const emergency = $derived([
		{ n: '190', label: m.city.police },
		{ n: '192', label: m.city.ambulance },
		{ n: '193', label: m.city.firefighters }
	]);
</script>

<svelte:head><title>{m.city.title} · Rumo</title></svelte:head>

<div class="page">
	<AppHeader {lang} label={m.languageLabel} />
	<main class="content">
		<h1>{m.city.title}</h1>

		<section class="stack">
			<h2>{m.city.emergencyTitle}</h2>
			<div class="grid3">
				{#each emergency as e (e.n)}
					<a class="call" href="tel:{e.n}"><strong>{e.n}</strong><span>{e.label}</span></a>
				{/each}
			</div>
		</section>

		<section class="stack">
			<h2>{m.city.healthTitle}</h2>
			<p class="notice notice-info">{m.city.susRight} <span class="small">({m.city.susSource})</span></p>
			<ul class="card levels">
				{#each levels as l (l.tag)}
					<li>
						<span class="tag {l.cls}">{l.tag}</span>
						<span class="stack tight"><strong>{l.title}</strong><span class="muted">{l.text}</span></span>
					</li>
				{/each}
			</ul>
			<p class="small">{m.city.generalGuidance}</p>
		</section>

		<p class="muted"><Icon name="pin" size={16} /> {m.city.comingSoon}</p>
	</main>
	<BottomNav {lang} current="city" labels={m.nav} />
</div>

<style>
	.grid3 {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.call {
		min-height: 64px;
		border-radius: var(--radius);
		background: var(--ink);
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-size: 0.75rem;
	}
	.call strong {
		font-size: 1.375rem;
	}
	.call:hover {
		color: #fff;
	}
	.levels {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.levels li {
		display: flex;
		gap: 12px;
		padding: 14px;
		border-bottom: 1px solid var(--line-2);
	}
	.levels li:last-child {
		border-bottom: 0;
	}
	.tight {
		gap: 2px;
	}
	.tag {
		flex-shrink: 0;
		min-width: 48px;
		text-align: center;
		font-size: 0.75rem;
		font-weight: 800;
		border-radius: 8px;
		padding: 4px 6px;
		align-self: flex-start;
	}
	.tag.b {
		background: var(--blue-tint);
		color: var(--blue-ink);
	}
	.tag.w {
		background: #fde9c4;
		color: #6b3f00;
	}
	.tag.r {
		background: #f8dada;
		color: #8a1f1f;
	}
</style>
