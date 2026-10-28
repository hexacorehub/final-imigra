// Locales with a complete interface translation. English, French and Haitian Creole
// are planned; add a file next to pt.ts/es.ts and list it here.
export const locales = ['pt', 'es'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = { pt: 'Português', es: 'Español' };
export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', es: 'es' };

export const isLocale = (v: unknown): v is Locale => locales.includes(v as Locale);

/** Replaces {name} placeholders. */
export function fmt(text: string, vars: Record<string, string | number> = {}): string {
	return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** Picks the best supported locale from the browser languages. */
export function preferredLocale(langs: readonly string[]): Locale {
	for (const l of langs) {
		const base = l.toLowerCase().split('-')[0];
		if (isLocale(base)) return base;
	}
	return 'pt';
}
