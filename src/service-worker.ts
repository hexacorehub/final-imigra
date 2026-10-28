/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

// Offline-first without burning the person's mobile data:
// - On install, cache only the app code and static files (small, needed by every page).
// - Pages and their data are cached the first time they are opened (and the path page
//   warms the person's own procedure pages), then served from cache when offline.
const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `rumo-${version}`;
const SHELL = [...build, ...files];
const SHELL_SET = new Set(SHELL);

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((c) => c.addAll(SHELL))
			.then(() => sw.skipWaiting())
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => sw.clients.claim())
	);
});

sw.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;
	const url = new URL(req.url);
	if (url.origin !== sw.location.origin) return; // never touch third-party requests

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// App code is versioned: cache first.
			if (SHELL_SET.has(url.pathname)) {
				const hit = await cache.match(url.pathname);
				if (hit) return hit;
			}

			// Pages and data: network first (content may have been updated), cache as fallback.
			try {
				const res = await fetch(req);
				if (res.ok && res.type === 'basic') cache.put(req, res.clone());
				return res;
			} catch (err) {
				const hit = await cache.match(req);
				if (hit) return hit;
				throw err;
			}
		})()
	);
});
