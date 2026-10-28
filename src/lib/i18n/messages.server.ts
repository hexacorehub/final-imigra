import type { Locale } from './index';
import type { Messages } from './pt';
import pt from './pt';
import es from './es';

// Server-only: each page receives just its own language through load(),
// so translations never end up in the JavaScript bundle.
const all: Record<Locale, Messages> = { pt, es };

export const messages = (locale: Locale): Messages => all[locale];
