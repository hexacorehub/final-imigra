import { kb } from '$lib/server/kb';
import type { PageServerLoad } from './$types';

// No interactivity on this page: ship plain HTML, zero JavaScript.
export const csr = false;

export const load: PageServerLoad = async () => {
	const repo = kb();
	const locations = await repo.locations('sao-paulo');
	// Order: who processes requests first, then confirmed places, then the ones still to confirm.
	const rank = (l: (typeof locations)[number]) =>
		(l.role?.startsWith('Processa') ? 0 : 1) * 10 + (l.status === 'Confirmado' ? 0 : l.status === 'Parcial' ? 1 : 2);
	return { locations: [...locations].sort((a, b) => rank(a) - rank(b)) };
};
