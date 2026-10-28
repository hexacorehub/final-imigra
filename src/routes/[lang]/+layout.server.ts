import { error } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';
import { messages } from '$lib/i18n/messages.server';
import { kb } from '$lib/server/kb';
import type { LayoutServerLoad } from './$types';

// Data every page in a language needs. Serialized once per page at build time;
// the browser gets only its own language and only this small slice of the KB.
export const load: LayoutServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) error(404, 'Idioma não disponível');
	const repo = kb();
	const [rules, summaries, meta, explanations] = await Promise.all([
		repo.countryRules(),
		repo.procedureSummaries(),
		repo.meta(),
		repo.explanations()
	]);
	return {
		lang: params.lang,
		m: messages(params.lang),
		rules,
		summaries,
		verifiedAt: meta.verifiedAt,
		// Short confirmed texts used in the triage (e.g. "what is a CPF").
		cpfInfo: explanations.filter((e) => e.confirmed && ['E01', 'E03', 'E04'].includes(e.id)).map((e) => e.text ?? '')
	};
};
