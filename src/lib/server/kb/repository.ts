import type {
	CountryRule,
	Explanation,
	KnowledgeBase,
	Location,
	ProcedureBundle,
	ProcedureSummary,
	Source
} from '$lib/kb/types';
import { stripSourceRefs } from '$lib/kb/display';

/**
 * Read-only access to the knowledge base. Pages only talk to this interface,
 * so the data can move from the bundled JSON to Supabase without touching the UI.
 * Runs on the server only (at build time, since every page is prerendered).
 */
export interface KnowledgeRepository {
	meta(): Promise<{ verifiedAt: string | null; locale: string }>;
	procedureIds(): Promise<string[]>;
	procedureSummaries(): Promise<ProcedureSummary[]>;
	countryRules(): Promise<CountryRule[]>;
	procedureBundle(id: string): Promise<ProcedureBundle | null>;
	locations(city: string): Promise<Location[]>;
	explanations(): Promise<Explanation[]>;
	sources(ids: string[]): Promise<Source[]>;
}

/** Shared helpers for implementations that hold the whole KB in memory. */
export function inMemoryRepository(load: () => Promise<KnowledgeBase>): KnowledgeRepository {
	let cache: Promise<KnowledgeBase> | null = null;
	const kb = () => (cache ??= load());

	const pickSources = (all: Source[], ids: string[]) => {
		const set = new Set(ids);
		return all.filter((s) => set.has(s.id));
	};

	return {
		async meta() {
			const k = await kb();
			return { verifiedAt: k.verifiedAt, locale: k.locale };
		},
		async procedureIds() {
			return (await kb()).procedures.map((p) => p.id);
		},
		async procedureSummaries() {
			const k = await kb();
			return k.procedures.map((p) => ({
				id: p.id,
				authority: p.authority,
				docIds: k.documents.filter((d) => d.processId === p.id).map((d) => d.id)
			}));
		},
		async countryRules() {
			return (await kb()).countries.map(({ iso, group, pfModalities, flows, outOfScope }) => ({
				iso,
				group,
				pfModalities,
				flows,
				outOfScope
			}));
		},
		async procedureBundle(id) {
			const k = await kb();
			const procedure = k.procedures.find((p) => p.id === id);
			if (!procedure) return null;
			const documents = k.documents.filter((d) => d.processId === id);
			const steps = k.steps.filter((s) => s.processId === id).sort((a, b) => a.order - b.order);
			// Explanations shown on a procedure page: only confirmed ones, and only for CPF today.
			const explanations = id === 'P-CPF' ? k.explanations.filter((e) => e.confirmed) : [];
			const ids = [
				...procedure.sources,
				...documents.flatMap((d) => d.sources),
				...steps.flatMap((s) => s.sources),
				...explanations.flatMap((e) => e.sources)
			];
			const c = stripSourceRefs;
			return {
				procedure: {
					...procedure,
					eligibility: c(procedure.eligibility),
					channel: c(procedure.channel),
					cost: c(procedure.cost),
					timing: c(procedure.timing),
					legalBasis: c(procedure.legalBasis),
					notes: c(procedure.notes)
				},
				documents: documents.map((d) => ({
					...d,
					name: c(d.name),
					condition: c(d.condition),
					alternatives: c(d.alternatives),
					howToGet: c(d.howToGet),
					formalities: c(d.formalities),
					note: c(d.note)
				})),
				steps: steps.map((s) => ({ ...s, text: c(s.text), time: c(s.time), cost: c(s.cost) })),
				explanations,
				sources: pickSources(k.sources, ids)
			};
		},
		async locations(city) {
			return (await kb()).locations.filter((l) => l.city === city);
		},
		async explanations() {
			return (await kb()).explanations;
		},
		async sources(ids) {
			return pickSources((await kb()).sources, ids);
		}
	};
}
