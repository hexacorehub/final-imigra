-- Rumo — schema inicial para Supabase.
-- Hoje o app roda sem banco (a base vem de src/lib/kb/data/kb.json).
-- Para ativar: crie o projeto, rode esta migration, rode supabase/seed.sql
-- e configure as variáveis do .env.example. Nada no app muda de forma.

-- =====================================================================
-- 1. Base de conhecimento (pública, só leitura para o app)
-- =====================================================================
create table kb_sources (
  id            text primary key,                 -- S01, S02…
  authority     text not null,
  title         text not null,
  url           text not null,
  type          text not null,                    -- "Oficial – página de serviço", "Secundária – …"
  page_updated  text,
  access        text,                             -- "Acessível", "Restrita (exige login) em …"
  verified_at   text
);

create table kb_procedures (
  id                  text primary key,           -- P-CPF, P-RES-VEN…
  name                text not null,
  jurisdiction        text,
  authority           text,
  eligibility         text,
  channel             text,
  cost                text,
  timing              text,
  legal_basis         text,
  source_ids          text[] not null default '{}',
  verification_status text,
  notes               text,
  verified_at         text
);

create type kb_doc_status as enum ('required', 'conditional', 'unconfirmed', 'not_required');

create table kb_documents (
  id            text primary key,                 -- D001…
  process_id    text not null references kb_procedures(id) on delete cascade,
  name          text not null,
  status        kb_doc_status not null,
  condition     text,
  alternatives  text,
  how_to_get    text,
  formalities   text,
  stage         text,
  source_ids    text[] not null default '{}',
  source_note   text,
  note          text
);
create index on kb_documents (process_id);

create table kb_steps (
  process_id    text not null references kb_procedures(id) on delete cascade,
  step_order    int  not null,
  text          text not null,
  link          text,
  time_estimate text,
  cost          text,
  source_ids    text[] not null default '{}',
  primary key (process_id, step_order)
);

create table kb_fees (
  id            bigint generated always as identity primary key,
  code          text,
  name          text not null,
  value_brl     numeric(10,2) not null,
  applies_when  text,
  exemption     text,
  source_ids    text[] not null default '{}'
);

create table kb_locations (
  id            text primary key,                 -- L01…
  city          text not null,                    -- 'sao-paulo'
  name          text not null,
  nature        text,
  role          text,
  address       text,
  hours         text,
  phone         text,
  email         text,
  services      text,
  appointment   text,
  source_ids    text[] not null default '{}',
  status        text,
  note          text
);
create index on kb_locations (city);

create table kb_countries (
  iso           text primary key,                 -- ISO 3166-1 alpha-2, '*' = todas
  name          text not null,
  group_name    text,
  pf_modalities text,
  flows         text[] not null default '{}',
  out_of_scope  boolean not null default false,
  note          text
);

create table kb_explanations (
  id            text primary key,                 -- E01…
  topic         text not null,
  text          text,
  status        text,
  confirmed     boolean not null default false,
  source_ids    text[] not null default '{}',
  note          text
);

-- Traduções do conteúdo (o conteúdo-base está em português).
create table kb_translations (
  entity        text not null,                    -- 'kb_documents', 'kb_steps'…
  entity_id     text not null,
  field         text not null,                    -- 'name', 'condition'…
  locale        text not null,                    -- 'es', 'en', 'fr', 'ht'
  text          text not null,
  reviewed      boolean not null default false,   -- só traduções revisadas aparecem
  primary key (entity, entity_id, field, locale)
);

-- Leitura pública, escrita só pelo service role (painel / scripts).
do $$
declare t text;
begin
  foreach t in array array['kb_sources','kb_procedures','kb_documents','kb_steps','kb_fees',
                           'kb_locations','kb_countries','kb_explanations','kb_translations']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "leitura pública" on %I for select using (true)', t);
  end loop;
end $$;

-- =====================================================================
-- 2. Dados do usuário (privados). Hoje ficam só no aparelho.
--    Estas tabelas permitem sincronizar entre aparelhos quando houver login.
--    Guardamos o mínimo: nenhuma foto de documento, nenhum motivo de refúgio.
-- =====================================================================
create table profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  locale        text not null default 'pt',
  nationality   text,                             -- ISO alpha-2
  location      text,                             -- 'br' | 'abroad'
  city          text,
  br_document   text,
  has_cpf       text,                             -- 'yes' | 'no' | 'unknown'
  goals         text[] not null default '{}',
  updated_at    timestamptz not null default now()
);

create table checklist_progress (
  user_id       uuid not null references auth.users(id) on delete cascade,
  document_id   text not null references kb_documents(id) on delete cascade,
  done          boolean not null default true,
  updated_at    timestamptz not null default now(),
  primary key (user_id, document_id)
);

alter table profiles enable row level security;
alter table checklist_progress enable row level security;

create policy "dono lê e escreve o próprio perfil" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "dono lê e escreve o próprio progresso" on checklist_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
