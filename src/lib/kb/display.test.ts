import { describe, expect, it } from 'vitest';
import kbJson from '$lib/kb/data/kb.json';
import type { KnowledgeBase } from './types';
import { stripSourceRefs } from './display';

describe('stripSourceRefs', () => {
	it('keeps the caveat and drops the code', () => {
		expect(stripSourceRefs('Temporária: 2 anos (S15 – confirmar na PF)')).toBe('Temporária: 2 anos (confirmar na PF)');
	});
	it('removes parentheses that only held codes', () => {
		expect(stripSourceRefs('R$ 168,13 + R$ 204,77 quando aplicáveis (S03, S16); isenção (S08)')).toBe(
			'R$ 168,13 + R$ 204,77 quando aplicáveis; isenção'
		);
	});
	it('drops a dangling preposition', () => {
		expect(stripSourceRefs('atendimento presencial (agendar em S20)')).toBe('atendimento presencial (agendar)');
	});
	it('keeps legal references that are not source codes', () => {
		expect(stripSourceRefs('Decreto nº 9.199/2017 (penalidade: art. 307, IV, segundo a FAQ da PF – S08)')).toBe(
			'Decreto nº 9.199/2017 (penalidade: art. 307, IV, segundo a FAQ da PF)'
		);
	});
	it('leaves text without codes untouched', () => {
		expect(stripSourceRefs('Lei nº 13.445/2017, art. 37')).toBe('Lei nº 13.445/2017, art. 37');
		expect(stripSourceRefs(null)).toBeNull();
	});
	it('no source code survives in any text shown to people', () => {
		const kb = kbJson as KnowledgeBase;
		const texts = [
			...kb.procedures.flatMap((p) => [p.eligibility, p.channel, p.cost, p.timing, p.legalBasis, p.notes]),
			...kb.documents.flatMap((d) => [d.name, d.condition, d.alternatives, d.howToGet, d.formalities, d.note]),
			...kb.steps.flatMap((s) => [s.text, s.time, s.cost])
		];
		for (const t of texts) expect(stripSourceRefs(t ?? '')).not.toMatch(/\bS\d{2}\b/);
	});
});
