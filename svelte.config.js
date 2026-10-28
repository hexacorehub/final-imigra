import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Supabase is optional. When PUBLIC_SUPABASE_URL is set at build time the browser
// is allowed to talk to it; otherwise the app makes no third-party requests at all.
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// Every page is prerendered to static HTML and served from Vercel's CDN.
		prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
		// Small CSS is inlined so the first paint needs no extra request on slow networks.
		inlineStyleThreshold: 4096,
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:'],
				'font-src': ['self'],
				'connect-src': supabaseUrl ? ['self', supabaseUrl] : ['self'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'object-src': ['none']
			}
		}
	}
};

export default config;
