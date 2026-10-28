// Shapes of the knowledge base. They mirror the spreadsheet tabs and the kb_* tables in Supabase.

export type DocStatus = 'required' | 'conditional' | 'unconfirmed' | 'not_required';

export interface Source {
	id: string;
	authority: string;
	title: string;
	url: string;
	type: string;
	pageUpdated: string | null;
	access: string | null;
	verifiedAt: string | null;
}

export interface Country {
	iso: string; // ISO 3166-1 alpha-2, '*' = every nationality
	name: string;
	group: string | null;
	pfModalities: string | null;
	flows: string[];
	outOfScope: boolean;
	note: string | null;
}

export interface Procedure {
	id: string;
	name: string;
	jurisdiction: string | null;
	authority: string | null;
	eligibility: string | null;
	channel: string | null;
	cost: string | null;
	timing: string | null;
	legalBasis: string | null;
	sources: string[];
	verificationStatus: string | null;
	notes: string | null;
	verifiedAt: string | null;
}

export interface KbDocument {
	id: string;
	processId: string;
	name: string;
	status: DocStatus;
	condition: string | null;
	alternatives: string | null;
	howToGet: string | null;
	formalities: string | null;
	stage: string | null;
	sources: string[];
	sourceNote: string | null;
	note: string | null;
}

export interface Step {
	processId: string;
	order: number;
	text: string;
	link: string | null;
	time: string | null;
	cost: string | null;
	sources: string[];
}

export interface Fee {
	code: string | null;
	name: string;
	value: number;
	appliesWhen: string | null;
	exemption: string | null;
	sources: string[];
}

export interface Location {
	id: string;
	city: string;
	name: string;
	nature: string | null;
	role: string | null;
	address: string | null;
	hours: string | null;
	phone: string | null;
	email: string | null;
	services: string | null;
	appointment: string | null;
	sources: string[];
	status: string | null;
	note: string | null;
}

export interface Explanation {
	id: string;
	topic: string;
	text: string | null;
	status: string | null;
	confirmed: boolean;
	sources: string[];
	note: string | null;
}

export interface KnowledgeBase {
	version: number;
	locale: string;
	verifiedAt: string | null;
	sources: Source[];
	countries: Country[];
	procedures: Procedure[];
	documents: KbDocument[];
	steps: Step[];
	fees: Fee[];
	locations: Location[];
	explanations: Explanation[];
}

/** Everything one procedure page needs, and nothing more. */
export interface ProcedureBundle {
	procedure: Procedure;
	documents: KbDocument[];
	steps: Step[];
	sources: Source[];
	explanations: Explanation[];
}

/** The small slice of the KB the browser needs to build a person's path. */
export interface ProcedureSummary {
	id: string;
	authority: string | null;
	docIds: string[];
}

export interface CountryRule {
	iso: string;
	group: string | null;
	pfModalities: string | null;
	flows: string[];
	outOfScope: boolean;
}
