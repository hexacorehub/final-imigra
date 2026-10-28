#!/usr/bin/env node
// Prints what a phone downloads to open each page (HTML + JS + CSS, gzip-compressed).
// Run after `npm run build`. Budget: 60 KB per page on first visit.
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { dirname, join, relative, resolve } from 'node:path';

const STATIC = '.vercel/output/static';
const BUDGET_KB = 60;

async function* walk(dir) {
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) yield* walk(p);
		else yield p;
	}
}

const gz = async (file) => gzipSync(await readFile(file)).length;
const rows = [];
for await (const file of walk(STATIC)) {
	if (!file.endsWith('.html')) continue;
	const html = await readFile(file, 'utf8');
	// Asset URLs may be absolute (/_app/…) or relative to the page (./_app/…, ../_app/…).
	const assets = new Set(
		[
			...html.matchAll(/(?:href|src)="((?:\.{1,2}\/)*\/?_app\/[^"]+\.(?:js|css))"/g),
			...html.matchAll(/import\("((?:\.{1,2}\/)*\/?_app\/[^"]+\.js)"\)/g)
		].map((m) => (m[1].startsWith('/') ? join(STATIC, m[1]) : resolve(dirname(file), m[1])))
	);
	let js = 0;
	let css = 0;
	for (const a of assets) {
		const size = await gz(a);
		if (a.endsWith('.css')) css += size;
		else js += size;
	}
	const htmlSize = gzipSync(html).length;
	rows.push({ page: '/' + relative(STATIC, file).replace(/(index)?\.html$/, ''), html: htmlSize, js, css, total: htmlSize + js + css });
}

rows.sort((a, b) => b.total - a.total);
const kb = (n) => (n / 1024).toFixed(1).padStart(6);
console.log('page'.padEnd(34), '  html', '    js', '   css', ' total (KB gz)');
for (const r of rows) console.log(r.page.padEnd(34), kb(r.html), kb(r.js), kb(r.css), kb(r.total));
const worst = rows[0];
const ok = worst.total / 1024 <= BUDGET_KB;
console.log(`\nMaior página: ${worst.page} = ${kb(worst.total).trim()} KB (orçamento ${BUDGET_KB} KB) ${ok ? 'OK' : 'ACIMA DO ORÇAMENTO'}`);
process.exit(ok ? 0 : 1);
