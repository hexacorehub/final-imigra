import { describe, expect, it } from 'vitest';
import kbJson from '$lib/kb/data/kb.json';
import type { CountryRule, KnowledgeBase } from '$lib/kb/types';
import { emptyProfile, type Profile } from '$lib/profile/types';
import { buildPath } from './path';

const kb = kbJson as KnowledgeBase;
const rules: CountryRule[] = kb.countries;
const profile = (p: Partial<Profile>): Profile => ({
	...emptyProfile(),
	location: 'br',
	city: 'sao-paulo',
	...p
});
const ids = (p: Profile) => buildPath(p, rules).steps.map((s) => s.processId);

describe('buildPath', () => {
	it('venezuelan without CPF who wants to live here: CPF first, then residence for Venezuela', () => {
		expect(ids(profile({ nationality: 'VE', hasCpf: 'no', brDocument: 'none', goals: ['live'] }))).toEqual([
			'P-CPF',
			'P-RES-VEN'
		]);
	});

	it('adds CPF automatically when the person does not know what it is', () => {
		const r = buildPath(profile({ nationality: 'BO', hasCpf: 'unknown', goals: ['live'] }), rules);
		expect(r.steps[0]).toEqual({ processId: 'P-CPF', reason: 'no-cpf' });
	});

	it('does not add CPF when the person already has one', () => {
		expect(ids(profile({ nationality: 'BO', hasCpf: 'yes', goals: ['live'] }))).toEqual(['P-RES-MERCOSUL']);
	});

	it('mercosur countries get the Mercosur residence', () => {
		for (const iso of ['AR', 'BO', 'CL', 'CO', 'EC', 'PY', 'PE', 'UY']) {
			expect(ids(profile({ nationality: iso, hasCpf: 'yes', goals: ['live'] }))).toEqual(['P-RES-MERCOSUL']);
		}
	});

	it('a visa or a published authorization leads to registration, not a new residence request', () => {
		expect(ids(profile({ nationality: 'VE', hasCpf: 'yes', brDocument: 'dou', goals: ['live'] }))).toEqual([
			'P-REG-CRNM'
		]);
		expect(ids(profile({ nationality: 'FR', hasCpf: 'yes', brDocument: 'visa', goals: ['live'] }))).toEqual([
			'P-REG-CRNM'
		]);
	});

	it('someone who already has a CRNM gets a notice, not a residence step', () => {
		const r = buildPath(profile({ nationality: 'VE', hasCpf: 'yes', brDocument: 'crnm', goals: ['live'] }), rules);
		expect(r.steps).toEqual([]);
		expect(r.notices).toContainEqual({ kind: 'has-crnm' });
	});

	it('countries with their own route outside the MVP get a notice with the PF modality', () => {
		const r = buildPath(profile({ nationality: 'HT', hasCpf: 'yes', goals: ['live'] }), rules);
		expect(r.steps).toEqual([]);
		expect(r.notices[0]).toMatchObject({ kind: 'own-modality' });
	});

	it('nationalities not in the PF list get a generic notice', () => {
		const r = buildPath(profile({ nationality: 'NG', hasCpf: 'yes', goals: ['live'] }), rules);
		expect(r.notices).toContainEqual({ kind: 'no-specific-modality' });
	});

	it('refuge: request + provisional document; with a protocol only the document', () => {
		expect(ids(profile({ nationality: 'NG', hasCpf: 'yes', goals: ['refuge'] }))).toEqual(['P-REFUGIO', 'P-DPRNM']);
		expect(ids(profile({ nationality: 'NG', hasCpf: 'yes', brDocument: 'protocol', goals: ['refuge'] }))).toEqual([
			'P-DPRNM'
		]);
	});

	it('family reunion and address are available for any nationality, in a stable order', () => {
		expect(
			ids(profile({ nationality: 'NG', hasCpf: 'no', goals: ['address', 'family'] }))
		).toEqual(['P-CPF', 'P-RES-REUNIAO', 'P-ENDERECO']);
	});

	it('abroad: no steps, only the consulate notice', () => {
		const r = buildPath(profile({ location: 'abroad', nationality: 'VE', hasCpf: 'no', goals: ['live'] }), rules);
		expect(r).toEqual({ steps: [], notices: [{ kind: 'abroad' }] });
	});

	it('every process the engine can return exists in the knowledge base', () => {
		const known = new Set(kb.procedures.map((p) => p.id));
		for (const id of ['P-CPF', 'P-RES-VEN', 'P-RES-MERCOSUL', 'P-RES-REUNIAO', 'P-REG-CRNM', 'P-REFUGIO', 'P-DPRNM', 'P-ENDERECO']) {
			expect(known.has(id)).toBe(true);
		}
	});
});

describe('knowledge base integrity', () => {
	it('every document points to an existing procedure and cites a known source', () => {
		const procs = new Set(kb.procedures.map((p) => p.id));
		const srcs = new Set(kb.sources.map((s) => s.id));
		for (const d of kb.documents) {
			expect(procs.has(d.processId)).toBe(true);
			for (const s of d.sources) expect(srcs.has(s)).toBe(true);
		}
	});

	it('only confirmed explanations carry text the app can show', () => {
		for (const e of kb.explanations.filter((e) => e.confirmed)) expect(e.text).toBeTruthy();
	});
});
