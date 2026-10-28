import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		// Optional Supabase connection for the browser (user sync). Empty = disabled.
		__SUPABASE_URL__: JSON.stringify(process.env.PUBLIC_SUPABASE_URL ?? ''),
		__SUPABASE_ANON_KEY__: JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY ?? '')
	},
	build: {
		// Target older Android WebViews / Chrome on low-end phones.
		target: ['es2020', 'chrome80', 'safari14']
	},
	test: {
		include: ['src/**/*.test.ts']
	}
});
