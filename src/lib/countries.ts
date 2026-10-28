// ISO 3166-1 alpha-2 codes. Names come from the browser (Intl.DisplayNames) in the
// person's language, so we ship ~1 KB instead of a translated country list.
export const ISO_CODES =
	'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'.split(
		' '
	);

/** Shown first: the nationalities that most often look for help in São Paulo. */
export const POPULAR = ['VE', 'HT', 'BO', 'CO', 'PY', 'AR'];

const cache = new Map<string, Intl.DisplayNames | null>();

export function countryName(iso: string, locale: string): string {
	if (!cache.has(locale)) {
		try {
			cache.set(locale, new Intl.DisplayNames([locale], { type: 'region' }));
		} catch {
			cache.set(locale, null); // very old browsers: fall back to the code
		}
	}
	return cache.get(locale)?.of(iso) ?? iso;
}

/** Lowercase and strip accents so "colombia" finds "Colômbia". */
export const normalize = (s: string) =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
