<script lang="ts">
	import { onMount } from 'svelte';
	let { data, children } = $props();

	onMount(() => {
		try {
			localStorage.setItem('rumo:locale', data.lang);
		} catch {
			/* ignore */
		}
	});
</script>

{@render children()}
