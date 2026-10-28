import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/** Lazily creates the browser Supabase client. Only imported when sync is enabled. */
export async function getSupabase(): Promise<SupabaseClient> {
	if (client) return client;
	if (!__SUPABASE_URL__ || !__SUPABASE_ANON_KEY__) throw new Error('Supabase não configurado');
	const { createClient } = await import('@supabase/supabase-js');
	client = createClient(__SUPABASE_URL__, __SUPABASE_ANON_KEY__);
	return client;
}
