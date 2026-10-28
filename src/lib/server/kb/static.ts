import kbJson from '$lib/kb/data/kb.json';
import type { KnowledgeBase } from '$lib/kb/types';
import { inMemoryRepository } from './repository';

/** Default: the KB generated from the spreadsheet by `npm run kb:import`. */
export const staticRepository = inMemoryRepository(async () => kbJson as KnowledgeBase);
