<script lang="ts">
	import type { DocStatus } from '$lib/kb/types';
	let { status, label }: { status: DocStatus; label: string } = $props();
</script>

<span class="badge badge-{status}">{label}</span>
