// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	const __SUPABASE_URL__: string;
	const __SUPABASE_ANON_KEY__: string;
}

export {};
