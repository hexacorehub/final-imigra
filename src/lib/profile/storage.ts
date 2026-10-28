import { emptyProfile, type Profile } from './types';

/**
 * Where the person's answers live. Today: only on the device.
 * A Supabase-backed implementation can sync the same shape (tables `profiles`
 * and `checklist_progress` in supabase/migrations/0001_init.sql) once login exists.
 */
export interface ProfileStorage {
	load(): Profile;
	save(profile: Profile): void;
	clear(): void;
}

const KEY = 'rumo:profile:v1';

export const localProfileStorage: ProfileStorage = {
	load() {
		try {
			const raw = localStorage.getItem(KEY);
			if (!raw) return emptyProfile();
			const parsed = JSON.parse(raw) as Partial<Profile>;
			return { ...emptyProfile(), ...parsed, version: 1 };
		} catch {
			// Private mode, blocked storage or corrupted data: start fresh, never crash.
			return emptyProfile();
		}
	},
	save(profile) {
		try {
			localStorage.setItem(KEY, JSON.stringify(profile));
		} catch {
			/* storage full or blocked: the app keeps working in memory */
		}
	},
	clear() {
		try {
			localStorage.removeItem(KEY);
		} catch {
			/* ignore */
		}
	}
};
