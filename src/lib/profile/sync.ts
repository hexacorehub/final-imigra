import type { Profile } from './types';

/**
 * Optional sync to Supabase. Disabled unless PUBLIC_SUPABASE_URL and
 * PUBLIC_SUPABASE_ANON_KEY are set at build time AND the person is signed in.
 * The Supabase client is loaded on demand, so it costs nothing when disabled.
 */
const enabled = Boolean(__SUPABASE_URL__ && __SUPABASE_ANON_KEY__);

let pending: ReturnType<typeof setTimeout> | null = null;

export function syncProfile(profile: Profile) {
	if (!enabled || typeof window === 'undefined') return;
	if (pending) clearTimeout(pending);
	pending = setTimeout(() => void push(profile), 1500); // debounce: one request per burst of taps
}

async function push(profile: Profile) {
	try {
		const { getSupabase } = await import('$lib/supabase/client');
		const db = await getSupabase();
		const { data } = await db.auth.getUser();
		const user = data.user;
		if (!user) return; // no login yet: data stays on the device only

		await db.from('profiles').upsert({
			user_id: user.id,
			nationality: profile.nationality,
			location: profile.location,
			city: profile.city,
			br_document: profile.brDocument,
			has_cpf: profile.hasCpf,
			goals: profile.goals,
			updated_at: profile.updatedAt
		});
		const rows = Object.keys(profile.ready).map((document_id) => ({
			user_id: user.id,
			document_id,
			done: true
		}));
		if (rows.length) await db.from('checklist_progress').upsert(rows);
	} catch {
		/* offline or misconfigured: the device copy is still the source of truth */
	}
}
