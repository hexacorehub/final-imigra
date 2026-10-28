import type { Handle } from '@sveltejs/kit';
import { htmlLang, isLocale } from '$lib/i18n';

// Sets <html lang> per route so screen readers and translation tools use the right language.
export const handle: Handle = async ({ event, resolve }) => {
	const seg = event.url.pathname.split('/')[1];
	const lang = isLocale(seg) ? htmlLang[seg] : 'pt-BR';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
