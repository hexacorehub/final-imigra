#!/usr/bin/env node
// Converts knowledge-base/base-de-conhecimento.xlsx into:
//   - src/lib/kb/data/kb.json   (bundled into the static build)
//   - supabase/seed.sql         (same data, ready for a Supabase project)
// The spreadsheet is the single source of truth. Run `npm run kb:import` after editing it.
import ExcelJS from 'exceljs';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const XLSX = resolve(root, 'knowledge-base/base-de-conhecimento.xlsx');
const OUT_JSON = resolve(root, 'src/lib/kb/data/kb.json');
const OUT_SQL = resolve(root, 'supabase/seed.sql');

// Country names in the spreadsheet → ISO 3166-1 alpha-2. '*' = applies to every nationality.
const ISO = {
	Argentina: 'AR', Bolívia: 'BO', Chile: 'CL', Colômbia: 'CO', Equador: 'EC', Paraguai: 'PY',
	Peru: 'PE', Uruguai: 'UY', Venezuela: 'VE', Guiana: 'GY', Suriname: 'SR', Haiti: 'HT',
	Cuba: 'CU', Ucrânia: 'UA', Afeganistão: 'AF', Síria: 'SY', Senegal: 'SN',
	'República Dominicana': 'DO', Portugal: 'PT', Angola: 'AO', 'Cabo Verde': 'CV',
	'Guiné-Bissau': 'GW', Moçambique: 'MZ', 'São Tomé e Príncipe': 'ST', 'Timor-Leste': 'TL',
	'Todas as nacionalidades': '*'
};

const DOC_STATUS = {
	Obrigatório: 'required',
	Condicional: 'conditional',
	'A confirmar': 'unconfirmed',
	'Não exigido': 'not_required'
};

const clean = (v) => {
	if (v == null) return null;
	if (typeof v === 'object' && 'result' in v) v = v.result; // formula cell
	if (typeof v === 'object' && 'richText' in v) v = v.richText.map((r) => r.text).join('');
	if (typeof v === 'object' && 'text' in v) v = v.text; // hyperlink cell
	if (typeof v === 'string') {
		const s = v.trim();
		return s === '' || s === '—' ? null : s;
	}
	return v;
};
const sourceIds = (v) => (v ? [...new Set(String(v).match(/S\d{2}/g) ?? [])] : []);

function readSheet(wb, name, columns) {
	const ws = wb.getWorksheet(name);
	if (!ws) throw new Error(`Aba "${name}" não encontrada na planilha`);
	const header = ws.getRow(1).values.slice(1).map((h) => clean(h));
	const idx = {};
	for (const [key, label] of Object.entries(columns)) {
		const i = header.indexOf(label);
		if (i === -1) throw new Error(`Coluna "${label}" não encontrada na aba "${name}"`);
		idx[key] = i + 1;
	}
	const rows = [];
	ws.eachRow((row, n) => {
		if (n === 1) return;
		const obj = {};
		for (const [key, i] of Object.entries(idx)) obj[key] = clean(row.getCell(i).value);
		rows.push(obj);
	});
	return rows;
}

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(XLSX);

const sources = readSheet(wb, 'Fontes', {
	id: 'source_id', authority: 'Órgão / autor', title: 'Título', url: 'URL', type: 'Tipo',
	pageUpdated: 'Atualização da página', access: 'Acesso na verificação', verifiedAt: 'Verificado em'
}).filter((r) => r.id);

const countries = readSheet(wb, 'Países', {
	name: 'País', group: 'Grupo', pfModalities: 'Modalidades de residência listadas pela PF (S09)',
	flow: 'Fluxo do app (MVP)', suggestedLanguage: 'Idioma sugerido', note: 'Observação'
})
	.filter((r) => r.name)
	.map((r) => {
		const iso = ISO[r.name];
		if (!iso) throw new Error(`País sem código ISO no import: ${r.name}`);
		const outOfScope = r.flow === 'FORA DO MVP';
		return {
			iso,
			name: r.name,
			group: r.group,
			pfModalities: r.pfModalities,
			flows: outOfScope ? [] : String(r.flow).split(',').map((s) => s.trim()),
			outOfScope,
			note: r.note
		};
	});

const procedures = readSheet(wb, 'Procedimentos', {
	id: 'process_id', name: 'Nome', jurisdiction: 'Jurisdição', authority: 'Órgão',
	eligibility: 'Quem pode usar', channel: 'Canal', cost: 'Custo', timing: 'Prazo / validade',
	legalBasis: 'Base legal', sources: 'Fontes', verificationStatus: 'Status da verificação',
	notes: 'Observações', verifiedAt: 'Verificado em'
})
	.filter((r) => r.id)
	.map((r) => ({ ...r, sources: sourceIds(r.sources) }));

const documents = readSheet(wb, 'Documentos', {
	id: 'doc_id', processId: 'process_id', name: 'Documento', status: 'Status',
	condition: 'Condição (quando se aplica)', alternatives: 'Alternativas aceitas', howToGet: 'Como obter',
	formalities: 'Formalidades (tradução / apostila)', stage: 'Etapa em que é apresentado',
	sources: 'Fonte', note: 'Observação'
})
	.filter((r) => r.id)
	.map((r) => {
		const status = DOC_STATUS[r.status];
		if (!status) throw new Error(`Status desconhecido em ${r.id}: ${r.status}`);
		return { ...r, status, sourceNote: r.sources, sources: sourceIds(r.sources) };
	});

const steps = readSheet(wb, 'Etapas', {
	processId: 'process_id', order: 'Nº', text: 'Etapa', link: 'Canal / link oficial',
	time: 'Tempo estimado', cost: 'Custo', sources: 'Fonte'
})
	.filter((r) => r.processId)
	.map((r) => ({
		...r,
		order: Number(r.order),
		link: r.link && /^https?:\/\//.test(r.link) ? r.link : null,
		sources: sourceIds(r.sources)
	}));

const fees = readSheet(wb, 'Taxas', {
	code: 'Código STN', name: 'Taxa', value: 'Valor (R$)', appliesWhen: 'Quando se aplica',
	exemption: 'Isenção', sources: 'Fonte'
})
	.filter((r) => r.name && typeof r.value === 'number' && r.appliesWhen)
	.map((r) => ({ ...r, sources: sourceIds(r.sources) }));

const locations = readSheet(wb, 'Locais SP', {
	id: 'id', name: 'Nome', nature: 'Natureza', role: 'Função', address: 'Endereço', hours: 'Horário',
	phone: 'Telefone', email: 'E-mail', services: 'Serviços', appointment: 'Agendamento',
	sources: 'Fonte', status: 'Status', note: 'Observação'
})
	.filter((r) => r.id)
	.map((r) => ({ ...r, city: 'sao-paulo', sources: sourceIds(r.sources) }));

const explanations = readSheet(wb, 'Explicações', {
	id: 'id', topic: 'Tema', text: 'Texto para o app (pt)', status: 'Status', sources: 'Fonte', note: 'Observação'
})
	.filter((r) => r.id)
	.map((r) => ({ ...r, confirmed: r.status === 'Confirmado', sources: sourceIds(r.sources) }));

// ---- integrity checks: a broken reference fails the import ----
const procIds = new Set(procedures.map((p) => p.id));
const srcIds = new Set(sources.map((s) => s.id));
const problems = [];
for (const d of documents) if (!procIds.has(d.processId)) problems.push(`Documento ${d.id}: process_id ${d.processId} não existe`);
for (const s of steps) if (!procIds.has(s.processId)) problems.push(`Etapa ${s.processId}#${s.order}: process_id não existe`);
for (const c of countries) for (const f of c.flows) if (!procIds.has(f)) problems.push(`País ${c.name}: fluxo ${f} não existe`);
for (const coll of [procedures, documents, steps, fees, locations, explanations])
	for (const r of coll) for (const s of r.sources ?? []) if (!srcIds.has(s)) problems.push(`Fonte ${s} citada mas não listada em Fontes`);
if (problems.length) {
	console.error('Erros na planilha:\n- ' + [...new Set(problems)].join('\n- '));
	process.exit(1);
}

const verifiedAt = procedures.map((p) => p.verifiedAt).filter(Boolean).sort().at(-1) ?? null;
const kb = {
	version: 1,
	locale: 'pt',
	verifiedAt,
	sources, countries, procedures, documents, steps, fees, locations, explanations
};
await mkdir(dirname(OUT_JSON), { recursive: true });
await writeFile(OUT_JSON, JSON.stringify(kb, null, '\t') + '\n');

// ---- Supabase seed ----
const q = (v) => {
	if (v == null) return 'null';
	if (typeof v === 'number' || typeof v === 'boolean') return String(v);
	if (Array.isArray(v)) return `array[${v.map(q).join(',')}]::text[]`;
	return `'${String(v).replace(/'/g, "''")}'`;
};
const insert = (table, cols, rows) =>
	rows.length
		? `insert into ${table} (${cols.map((c) => c[0]).join(', ')}) values\n` +
			rows.map((r) => `  (${cols.map(([, k]) => q(r[k])).join(', ')})`).join(',\n') +
			';\n'
		: '';
const sql = [
	'-- Gerado por scripts/import-kb.mjs a partir de knowledge-base/base-de-conhecimento.xlsx. Não edite à mão.',
	'begin;',
	'truncate kb_documents, kb_steps, kb_fees, kb_locations, kb_countries, kb_explanations, kb_procedures, kb_sources cascade;',
	insert('kb_sources', [['id', 'id'], ['authority', 'authority'], ['title', 'title'], ['url', 'url'], ['type', 'type'], ['page_updated', 'pageUpdated'], ['access', 'access'], ['verified_at', 'verifiedAt']], sources),
	insert('kb_procedures', [['id', 'id'], ['name', 'name'], ['jurisdiction', 'jurisdiction'], ['authority', 'authority'], ['eligibility', 'eligibility'], ['channel', 'channel'], ['cost', 'cost'], ['timing', 'timing'], ['legal_basis', 'legalBasis'], ['source_ids', 'sources'], ['verification_status', 'verificationStatus'], ['notes', 'notes'], ['verified_at', 'verifiedAt']], procedures),
	insert('kb_documents', [['id', 'id'], ['process_id', 'processId'], ['name', 'name'], ['status', 'status'], ['condition', 'condition'], ['alternatives', 'alternatives'], ['how_to_get', 'howToGet'], ['formalities', 'formalities'], ['stage', 'stage'], ['source_ids', 'sources'], ['source_note', 'sourceNote'], ['note', 'note']], documents),
	insert('kb_steps', [['process_id', 'processId'], ['step_order', 'order'], ['text', 'text'], ['link', 'link'], ['time_estimate', 'time'], ['cost', 'cost'], ['source_ids', 'sources']], steps),
	insert('kb_fees', [['code', 'code'], ['name', 'name'], ['value_brl', 'value'], ['applies_when', 'appliesWhen'], ['exemption', 'exemption'], ['source_ids', 'sources']], fees),
	insert('kb_locations', [['id', 'id'], ['city', 'city'], ['name', 'name'], ['nature', 'nature'], ['role', 'role'], ['address', 'address'], ['hours', 'hours'], ['phone', 'phone'], ['email', 'email'], ['services', 'services'], ['appointment', 'appointment'], ['source_ids', 'sources'], ['status', 'status'], ['note', 'note']], locations),
	insert('kb_countries', [['iso', 'iso'], ['name', 'name'], ['group_name', 'group'], ['pf_modalities', 'pfModalities'], ['flows', 'flows'], ['out_of_scope', 'outOfScope'], ['note', 'note']], countries),
	insert('kb_explanations', [['id', 'id'], ['topic', 'topic'], ['text', 'text'], ['status', 'status'], ['confirmed', 'confirmed'], ['source_ids', 'sources'], ['note', 'note']], explanations),
	'commit;',
	''
].join('\n');
await writeFile(OUT_SQL, sql);

console.log(
	`KB importada: ${procedures.length} procedimentos, ${documents.length} documentos, ${steps.length} etapas, ` +
		`${countries.length} países, ${locations.length} locais, ${explanations.length} explicações, ${sources.length} fontes.`
);
