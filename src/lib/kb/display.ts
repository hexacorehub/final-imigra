// The spreadsheet cites sources inline for reviewers, e.g. "2 anos (S15 – confirmar na PF)".
// People should see the caveat, not the internal code: "2 anos (confirmar na PF)".
// Sources are still listed, with links, at the bottom of every procedure page.
const REF = /\bS\d{2}\b/g;
const HAS_REF = /\bS\d{2}\b/; // non-global: .test() must not carry lastIndex between calls

export function stripSourceRefs(text: string): string;
export function stripSourceRefs(text: string | null): string | null;
export function stripSourceRefs(text: string | null): string | null {
	if (!text) return text;
	const out = text
		.replace(/\(([^()]*)\)/g, (_, inner: string) => {
			if (!HAS_REF.test(inner)) return `(${inner})`;
			const s = inner
				.replace(REF, '')
				.replace(/\s*[–,;]\s*(?=\s*(?:[–,;]|$))/g, '') // separators left dangling
				.replace(/^\s*[–,;]\s*/, '')
				.replace(/\s+(?:em|na|no|da|do|nas|nos)\s*$/i, '') // "agendar em S20" → "agendar"
				.replace(/\s{2,}/g, ' ')
				.trim();
			return s ? `(${s})` : '';
		})
		.replace(REF, '')
		.replace(/\s+([.,;:)])/g, '$1')
		.replace(/\s{2,}/g, ' ')
		.trim();
	return out;
}
