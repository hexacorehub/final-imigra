import { browser } from '$app/environment';
import { localProfileStorage, type ProfileStorage } from './storage';
import { emptyProfile, type Profile } from './types';
import { syncProfile } from './sync';

/**
 * The person's answers as reactive state (Svelte 5 runes), persisted on every change.
 * Pages read `profile.value` and call `profile.update(...)`.
 */
class ProfileState {
	value = $state<Profile>(emptyProfile());
	loaded = $state(false);
	#storage: ProfileStorage;

	constructor(storage: ProfileStorage) {
		this.#storage = storage;
		if (browser) {
			this.value = storage.load();
			this.loaded = true;
		}
	}

	update(patch: Partial<Profile>) {
		this.value = { ...this.value, ...patch, updatedAt: new Date().toISOString() };
		this.#storage.save(this.value);
		syncProfile(this.value);
	}

	toggleReady(docId: string) {
		const ready = { ...this.value.ready };
		if (ready[docId]) delete ready[docId];
		else ready[docId] = true;
		this.update({ ready });
	}

	reset() {
		this.#storage.clear();
		this.value = emptyProfile();
	}
}

export const profile = new ProfileState(localProfileStorage);
