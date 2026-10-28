import type { KnowledgeBase } from '$lib/kb/types';
import { inMemoryRepository } from './repository';

/**
 * Reads the kb_* tables (see supabase/migrations/0001_init.sql) once per build.
 * Pages stay prerendered: Supabase works as the editing backend, Vercel serves static files.
 * Enable with KB_SOURCE=supabase plus SUPABASE_URL and SUPABASE_ANON_KEY.
 */
export function supabaseRepository(url: string, anonKey: string) {
	return inMemoryRepository(async (): Promise<KnowledgeBase> => {
		const { createClient } = await import('@supabase/supabase-js');
		const db = createClient(url, anonKey, { auth: { persistSession: false } });

		const all = async <T>(table: string, order: string) => {
			const { data, error } = await db.from(table).select('*').order(order);
			if (error) throw new Error(`Supabase: falha ao ler ${table}: ${error.message}`);
			return data as T[];
		};

		type Row = Record<string, any>;
		const [sources, procedures, documents, steps, fees, locations, countries, explanations] =
			await Promise.all([
				all<Row>('kb_sources', 'id'),
				all<Row>('kb_procedures', 'id'),
				all<Row>('kb_documents', 'id'),
				all<Row>('kb_steps', 'step_order'),
				all<Row>('kb_fees', 'id'),
				all<Row>('kb_locations', 'id'),
				all<Row>('kb_countries', 'iso'),
				all<Row>('kb_explanations', 'id')
			]);

		const verifiedAt =
			procedures.map((p) => p.verified_at).filter(Boolean).sort().at(-1) ?? null;

		return {
			version: 1,
			locale: 'pt',
			verifiedAt,
			sources: sources.map((s) => ({
				id: s.id, authority: s.authority, title: s.title, url: s.url, type: s.type,
				pageUpdated: s.page_updated, access: s.access, verifiedAt: s.verified_at
			})),
			procedures: procedures.map((p) => ({
				id: p.id, name: p.name, jurisdiction: p.jurisdiction, authority: p.authority,
				eligibility: p.eligibility, channel: p.channel, cost: p.cost, timing: p.timing,
				legalBasis: p.legal_basis, sources: p.source_ids, verificationStatus: p.verification_status,
				notes: p.notes, verifiedAt: p.verified_at
			})),
			documents: documents.map((d) => ({
				id: d.id, processId: d.process_id, name: d.name, status: d.status, condition: d.condition,
				alternatives: d.alternatives, howToGet: d.how_to_get, formalities: d.formalities,
				stage: d.stage, sources: d.source_ids, sourceNote: d.source_note, note: d.note
			})),
			steps: steps.map((s) => ({
				processId: s.process_id, order: s.step_order, text: s.text, link: s.link,
				time: s.time_estimate, cost: s.cost, sources: s.source_ids
			})),
			fees: fees.map((f) => ({
				code: f.code, name: f.name, value: Number(f.value_brl), appliesWhen: f.applies_when,
				exemption: f.exemption, sources: f.source_ids
			})),
			locations: locations.map((l) => ({
				id: l.id, city: l.city, name: l.name, nature: l.nature, role: l.role, address: l.address,
				hours: l.hours, phone: l.phone, email: l.email, services: l.services,
				appointment: l.appointment, sources: l.source_ids, status: l.status, note: l.note
			})),
			countries: countries.map((c) => ({
				iso: c.iso, name: c.name, group: c.group_name, pfModalities: c.pf_modalities,
				flows: c.flows, outOfScope: c.out_of_scope, note: c.note
			})),
			explanations: explanations.map((e) => ({
				id: e.id, topic: e.topic, text: e.text, status: e.status, confirmed: e.confirmed,
				sources: e.source_ids, note: e.note
			}))
		};
	});
}
