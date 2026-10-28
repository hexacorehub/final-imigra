import type { KnowledgeRepository } from './repository';
import { staticRepository } from './static';
import { supabaseRepository } from './supabase';

let repo: KnowledgeRepository | null = null;

/** Picks the KB backend from the build environment. Defaults to the bundled JSON. */
export function kb(): KnowledgeRepository {
	if (repo) return repo;
	const source = process.env.KB_SOURCE ?? 'static';
	if (source === 'supabase') {
		const url = process.env.SUPABASE_URL;
		const key = process.env.SUPABASE_ANON_KEY;
		if (!url || !key) throw new Error('KB_SOURCE=supabase exige SUPABASE_URL e SUPABASE_ANON_KEY');
		repo = supabaseRepository(url, key);
	} else {
		repo = staticRepository;
	}
	return repo;
}
