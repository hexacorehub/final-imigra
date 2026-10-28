import type { CountryRule } from '$lib/kb/types';
import type { Profile } from '$lib/profile/types';

/**
 * Builds a person's path from their triage answers.
 * Pure function: the same answers always give the same path. No AI, no network.
 * The rules here are the ones written in the "Fluxos de conversa e regras da IA" doc.
 */

export type StepReason =
	| 'no-cpf' // added automatically: the person has no CPF or doesn't know what it is
	| 'residence' // residence authorization for their nationality
	| 'registration' // already has a visa or a published authorization: register and get the CRNM
	| 'family'
	| 'refuge'
	| 'refuge-document'
	| 'address';

export interface PathStep {
	processId: string;
	reason: StepReason;
}

export type Notice =
	| { kind: 'abroad' }
	| { kind: 'has-crnm' }
	| { kind: 'own-modality'; modalities: string | null } // country has its own route, not in the MVP yet
	| { kind: 'no-specific-modality' } // nationality without a specific route in the PF list
	| { kind: 'nothing-selected' };

export interface PathResult {
	steps: PathStep[];
	notices: Notice[];
}

const RESIDENCE_FLOWS = new Set(['P-RES-VEN', 'P-RES-MERCOSUL']);

export function buildPath(profile: Profile, rules: CountryRule[]): PathResult {
	const steps: PathStep[] = [];
	const notices: Notice[] = [];
	const add = (processId: string, reason: StepReason) => {
		if (!steps.some((s) => s.processId === processId)) steps.push({ processId, reason });
	};

	if (profile.location === 'abroad') {
		// Outside Brazil the path starts at a consulate, which the MVP does not cover yet.
		return { steps, notices: [{ kind: 'abroad' }] };
	}

	if (profile.hasCpf !== 'yes') add('P-CPF', 'no-cpf');

	const goals = new Set(profile.goals);

	if (goals.has('live')) {
		const doc = profile.brDocument;
		if (doc === 'crnm') {
			notices.push({ kind: 'has-crnm' });
		} else if (doc === 'visa' || doc === 'dou') {
			add('P-REG-CRNM', 'registration');
		} else {
			const rule = rules.find((r) => r.iso === profile.nationality);
			const flows = rule?.flows.filter((f) => RESIDENCE_FLOWS.has(f)) ?? [];
			if (flows.length) flows.forEach((f) => add(f, 'residence'));
			else if (rule?.outOfScope) notices.push({ kind: 'own-modality', modalities: rule.pfModalities });
			else notices.push({ kind: 'no-specific-modality' });
		}
	}

	if (goals.has('family')) add('P-RES-REUNIAO', 'family');

	if (goals.has('refuge')) {
		if (profile.brDocument === 'protocol' || profile.brDocument === 'dprnm') {
			add('P-DPRNM', 'refuge-document');
		} else {
			add('P-REFUGIO', 'refuge');
			add('P-DPRNM', 'refuge-document');
		}
	}

	if (goals.has('address')) add('P-ENDERECO', 'address');

	if (!goals.size && steps.length === 0) notices.push({ kind: 'nothing-selected' });

	return { steps, notices };
}

/** Country group for the badge on the country list (Mercosul, fronteiriço…). */
export function countryGroup(iso: string, rules: CountryRule[]): string | null {
	return rules.find((r) => r.iso === iso)?.group ?? null;
}
