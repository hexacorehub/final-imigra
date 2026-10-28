# Rumo

Orientação para imigrantes no Brasil, com base em fontes oficiais. A pessoa escolhe país, situação e objetivo; o app monta um caminho com o que levar, onde ir e o passo a passo de cada procedimento.

> App independente, sem vínculo com a Polícia Federal ou outros órgãos públicos. Não substitui orientação jurídica.

## Feito para celulares simples e internet ruim

- **Páginas estáticas.** Todas as 35 páginas são geradas no build e servidas pela CDN do Vercel. Não há servidor nem banco no caminho de uma visita, então o custo não cresce com o número de usuários.
- **Leve.** A maior página pesa ~57 KB (HTML + JS + CSS, gzip). Cidade e Ajuda não carregam JavaScript nenhum (~5 KB). Sem fontes web, sem bibliotecas de UI, ícones em SVG inline.
- **Funciona offline.** O service worker guarda o app na primeira visita e as páginas do caminho da pessoa assim que ela termina a triagem.
- **Navegadores antigos.** Build para Chrome 80 / Safari 14. Nomes de países vêm do próprio navegador (`Intl.DisplayNames`), sem lista traduzida no pacote.
- **Privacidade.** As respostas ficam só no aparelho (`localStorage`). Nada de fotos de documentos, nada sobre motivos de refúgio.

Medido em emulação de celular simples (3G lento: 400 kbps, 400 ms; CPU 4x mais lenta): primeira carga em ~1,7 s.

## Como rodar

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # regras do caminho + integridade da base
npm run check        # tipos
npm run build && npm run size   # build + relatório de peso por página (orçamento: 60 KB)
```

Node 22 (veja `.nvmrc`).

## Deploy no Vercel

Importe o repositório no Vercel. O framework (SvelteKit) é detectado sozinho; não precisa de variáveis de ambiente. Cabeçalhos de segurança estão em `vercel.json` e a CSP é gerada pelo SvelteKit.

## Base de conhecimento

A fonte única de verdade é a planilha `knowledge-base/base-de-conhecimento.xlsx` (abas Procedimentos, Documentos, Etapas, Taxas, Países, Locais SP, Explicações, Fontes). Cada linha tem fonte e data de verificação.

Depois de editar a planilha:

```bash
npm run kb:import    # gera src/lib/kb/data/kb.json e supabase/seed.sql
npm test             # confere referências quebradas
```

O import falha se um documento apontar para um procedimento inexistente ou citar uma fonte que não está na aba Fontes.

Regras de exibição:
- Documentos têm status **Obrigatório**, **Condicional** ou **A confirmar**. "A confirmar" nunca aparece como certo: vem com aviso e link para o canal oficial.
- Explicações (aba Explicações) só aparecem quando estão "Confirmado".
- Códigos internos de fonte (S01, S15…) são retirados do texto mostrado; as fontes aparecem com link no fim de cada página.

## Como o caminho é montado

`src/lib/engine/path.ts` é uma função pura, coberta por testes em `path.test.ts`:

- CPF entra sozinho como etapa 1 se a pessoa responde "Não" ou "Não sei o que é".
- "Morar legalmente": Venezuela/Guiana/Suriname → residência para fronteiriços; países do Mercosul → Acordo Mercosul; quem já tem visto ou autorização publicada → registro e CRNM; quem já tem CRNM → aviso.
- Países com modalidade própria fora do MVP (Haiti, Ucrânia, CPLP…) recebem aviso e encaminhamento ao CRAI.
- Reunião familiar, refúgio e endereço valem para qualquer nacionalidade.
- Fora do Brasil: aviso de que o caminho começa no consulado (fora do MVP).

## Pronto para Supabase

Nada muda nas telas ao ligar o Supabase; só a origem dos dados.

1. Crie o projeto e rode `supabase/migrations/0001_init.sql` e depois `supabase/seed.sql`.
2. **Base de conhecimento no Supabase:** defina `KB_SOURCE=supabase`, `SUPABASE_URL` e `SUPABASE_ANON_KEY` no Vercel. O build lê as tabelas `kb_*` e continua gerando páginas estáticas. Configure um deploy hook para publicar quando a base mudar.
3. **Sincronizar usuários entre aparelhos (quando houver login):** defina `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY`. O cliente Supabase só é baixado nesse caso. As tabelas `profiles` e `checklist_progress` têm RLS: cada pessoa só lê e escreve os próprios dados.

O acesso aos dados passa por interfaces (`src/lib/server/kb/repository.ts` e `src/lib/profile/storage.ts`), com uma implementação estática e uma Supabase.

## Estrutura

```
knowledge-base/            planilha (fonte da verdade)
scripts/import-kb.mjs      planilha → kb.json + seed.sql
scripts/size-report.mjs    peso de cada página
supabase/                  schema (migrations) e seed gerado
src/lib/engine/            regras do caminho (puras, testadas)
src/lib/server/kb/         repositório da base (estático | Supabase)
src/lib/profile/           respostas da pessoa (aparelho; sync opcional)
src/lib/i18n/              textos da interface (pt, es)
src/routes/                telas: idioma → país → situação → objetivo → resumo → caminho
src/service-worker.ts      offline
```

## Idiomas

Interface em português e espanhol. O conteúdo oficial (documentos, etapas) ainda está só em português, com aviso na versão em espanhol. Para adicionar inglês, francês ou crioulo haitiano: crie `src/lib/i18n/<código>.ts` seguindo `es.ts` e inclua o código em `src/lib/i18n/index.ts`. Traduções do conteúdo oficial têm lugar na tabela `kb_translations` (com campo `reviewed`).

## Próximos passos

- Tradução revisada do conteúdo oficial para espanhol (público venezuelano).
- Itens "A confirmar" da planilha (lista no documento de regras da IA).
- Guia de transporte e segurança, com fontes.
- Login e sincronização via Supabase.
