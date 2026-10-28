export type Location = 'br' | 'abroad';
export type BrDocument = 'none' | 'protocol' | 'dprnm' | 'crnm' | 'visa' | 'dou' | 'unknown';
export type HasCpf = 'yes' | 'no' | 'unknown';
export type Goal = 'live' | 'family' | 'refuge' | 'address';

/**
 * Everything the person chose in the triage. Kept on the device (localStorage).
 * Deliberately minimal: no names, no document photos, no reasons for asking for refuge.
 */
export interface Profile {
	version: 1;
	nationality: string | null; // ISO 3166-1 alpha-2
	location: Location | null;
	city: string | null;
	brDocument: BrDocument | null;
	hasCpf: HasCpf | null;
	goals: Goal[];
	/** Checklist items the person marked as ready, by document id. */
	ready: Record<string, true>;
	completedAt: string | null;
	updatedAt: string | null;
}

export const emptyProfile = (): Profile => ({
	version: 1,
	nationality: null,
	location: null,
	city: null,
	brDocument: null,
	hasCpf: null,
	goals: [],
	ready: {},
	completedAt: null,
	updatedAt: null
});
