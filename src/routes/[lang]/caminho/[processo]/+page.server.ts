import { error } from '@sveltejs/kit';
import { locales } from '$lib/i18n';
import { kb } from '$lib/server/kb';
import type { EntryGenerator, PageServerLoad } from './$types';

// One static page per procedure and language, so each checklist works offline.
export const entries: EntryGenerator = async () => {
	const ids = await kb().procedureIds();
	return locales.flatMap((lang) => ids.map((processo) => ({ lang, processo })));
};

export const load: PageServerLoad = async ({ params }) => {
	const bundle = await kb().procedureBundle(params.processo);
	if (!bundle) error(404, 'Procedimento não encontrado');
	return { bundle };
};
