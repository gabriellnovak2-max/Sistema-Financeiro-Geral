# .cursor/BUGBOT-CURSOR.md

Auditoria forense Cursor (01/05/2026) sobre o código real do repositório.
Objetivo: complementar e endurecer o `BUGBOT.md` com cicatrizes que só aparecem lendo arquivo+linha+commit.

---

## Tarefa 1 — Varredura por Arquivo (linha por linha)

### Cicatriz 01
- Arquivo: `server/middleware/requireAuth.ts`
- Linha: `6-8`
- Tipo: 🛡️
- Cicatriz: `throw` no top-level mata o processo no import quando falta env.
- Commit que originou: `ee9f192`
- Por que é problema: gera 502 silencioso antes do app abrir porta.
- Como Bugbot detecta: AST `ThrowStatement` fora de função.
- Severidade: 🔴

### Cicatriz 02
- Arquivo: `server/storage.ts`
- Linha: `7-9`
- Tipo: 🛡️
- Cicatriz: mesmo padrão de `throw` no top-level para env de Supabase.
- Commit que originou: `02577a8`
- Por que é problema: queda total de API em ambiente sem variável.
- Como Bugbot detecta: regex `^if \\(!.*\\)\\s*\\{\\s*throw new Error` em escopo de módulo.
- Severidade: 🔴

### Cicatriz 03
- Arquivo: `server/storage.ts`
- Linha: `5`
- Tipo: 🛡️
- Cicatriz: fallback para `SUPABASE_SECRET_KEY` cria ambiguidade operacional.
- Commit que originou: `02577a8`
- Por que é problema: mistura padrões de segredo e mascara env faltando.
- Como Bugbot detecta: regex `SUPABASE_SERVICE_ROLE_KEY\\s*\\|\\|\\s*process\\.env\\.SUPABASE_SECRET_KEY`.
- Severidade: 🟡

### Cicatriz 04
- Arquivo: `server/routes.ts`
- Linha: `30-33`
- Tipo: 🐛
- Cicatriz: `DELETE /api/vendas/:id` sem try/catch e sem validação de id.
- Commit que originou: `1fef74c`
- Por que é problema: parse de `NaN` pode gerar operação inesperada e erro cru.
- Como Bugbot detecta: AST rota `delete` sem bloco `try`.
- Severidade: 🟡

### Cicatriz 05
- Arquivo: `server/routes.ts`
- Linha: `19`
- Tipo: 🐛
- Cicatriz: `parseInt(req.params.id)` sem checar `Number.isFinite`.
- Commit que originou: `0b27375` (bloco de PATCH atual)
- Por que é problema: `NaN` flui para camada de storage.
- Como Bugbot detecta: regex `parseInt\\(req\\.params\\.[^)]+\\)` sem guard de validação no handler.
- Severidade: 🟡

### Cicatriz 06
- Arquivo: `server/routes.ts`
- Linha: `11,16,28,35,40,52,59,69`
- Tipo: 🧠
- Cicatriz: `catch (e)` ignorado; erro real não é logado.
- Commit que originou: `9de7a10`
- Por que é problema: troubleshooting no Railway fica cego.
- Como Bugbot detecta: AST `CatchClause` sem `console.error|logger|throw`.
- Severidade: 🟡

### Cicatriz 07
- Arquivo: `server/index.ts`
- Linha: `73`
- Tipo: 🛡️
- Cicatriz: log de resposta inclui payload completo de `/api/*`.
- Commit que originou: `1fef74c` (base do logger)
- Por que é problema: risco de vazar dados pessoais em log central.
- Como Bugbot detecta: regex `JSON\\.stringify\\(capturedJsonResponse\\)`.
- Severidade: 🔴

### Cicatriz 08
- Arquivo: `server/index.ts`
- Linha: `88,93`
- Tipo: 🧠
- Cicatriz: uso de `as any` no middleware e no handler de erro.
- Commit que originou: `ee9f192`
- Por que é problema: desliga proteção de tipos em ponto crítico.
- Como Bugbot detecta: regex `as any` em `server/index.ts`.
- Severidade: 🟡

### Cicatriz 09
- Arquivo: `server/storage.ts`
- Linha: `13,33,102,146`
- Tipo: 🧠
- Cicatriz: `any` em mapeamento de dados de banco.
- Commit que originou: `02577a8`
- Por que é problema: permite drift silencioso de schema/contrato.
- Como Bugbot detecta: regex `:\\s*any` em `server/storage.ts`.
- Severidade: 🟡

### Cicatriz 10
- Arquivo: `client/src/lib/supabase.ts`
- Linha: `3-7`
- Tipo: ⚙️
- Cicatriz: cria client sem validar `VITE_SUPABASE_URL`/chave antes.
- Commit que originou: `f0ad27b` + `00124ad`
- Por que é problema: quebra em runtime com erro pouco amigável.
- Como Bugbot detecta: arquivo `supabase.ts` com `createClient(` sem bloco `if (!var)`.
- Severidade: 🟡

### Cicatriz 11
- Arquivo: `client/src/lib/queryClient.ts`
- Linha: `55-57` + `90-93`
- Tipo: 🐛
- Cicatriz: fallback silencioso de base URL pode mascarar config errada.
- Commit que originou: `ad8a3a2`
- Por que é problema: request vai para origem errada e vira bug intermitente.
- Como Bugbot detecta: regex `new Set\\(\\[getApiBase\\(\\),\\s*\"\"\\]\\)`.
- Severidade: 🟡

### Cicatriz 12
- Arquivo: `client/src/lib/queryClient.ts`
- Linha: `114-115`
- Tipo: 🐛
- Cicatriz: parser JSON obrigatório; endpoints 204/plain text quebram query.
- Commit que originou: base `353a938`
- Por que é problema: incompatibilidade futura com respostas sem body JSON.
- Como Bugbot detecta: AST retorno direto `res.json()` sem validar content-type/status.
- Severidade: 🟢

### Cicatriz 13
- Arquivo: `client/src/App.tsx`
- Linha: `46`
- Tipo: 🏗️
- Cicatriz: roteamento por hash (`useHashLocation`) fixo.
- Commit que originou: base `353a938`
- Por que é problema: URL real não representa estado; analytics e SEO pioram.
- Como Bugbot detecta: regex `useHashLocation`.
- Severidade: 🟢

### Cicatriz 14
- Arquivo: `client/src/pages/Vendas.tsx`
- Linha: `660,675,815,827,850,986,989`
- Tipo: 🧠
- Cicatriz: `any` espalhado em formulário/mutations.
- Commit que originou: base `353a938` + incrementais
- Por que é problema: regressão de tipo passa no build e quebra no usuário.
- Como Bugbot detecta: regex `\\bany\\b` no arquivo.
- Severidade: 🟡

### Cicatriz 15
- Arquivo: `client/src/pages/Vendas.tsx`
- Linha: `965`
- Tipo: 🐛
- Cicatriz: conversão de data concatena `"T12:00:00"` em valor já timestamp.
- Commit que originou: base `353a938`
- Por que é problema: risco de `Invalid Date` em formatos ISO completos.
- Como Bugbot detecta: regex `new Date\\(.*\\+\\s*\"T12:00:00\"\\)`.
- Severidade: 🟡

### Cicatriz 16
- Arquivo: `client/src/pages/Vendas.tsx`
- Linha: `1011`
- Tipo: 🧠
- Cicatriz: `confirm()` nativo no browser.
- Commit que originou: base `353a938`
- Por que é problema: UX inconsistente e difícil testar em E2E.
- Como Bugbot detecta: regex `\\bconfirm\\(`.
- Severidade: 🟢

### Cicatriz 17
- Arquivo: `client/src/pages/Calendario.tsx`
- Linha: `99-100`, `185-186`, `299-300`, `397-399`, `495-497`, `598-600`
- Tipo: 🐛
- Cicatriz: parsing de data por `startsWith`/`substring` em string crua.
- Commit que originou: `57f8e40`
- Por que é problema: frágil a timezone e formato de timestamp.
- Como Bugbot detecta: regex `\\.data\\.startsWith\\(|\\.data\\.substring\\(`.
- Severidade: 🟡

### Cicatriz 18
- Arquivo: `client/src/pages/Calendario.tsx`
- Linha: `37`
- Tipo: 🧠
- Cicatriz: `StatCard` com props `any`.
- Commit que originou: `57f8e40`
- Por que é problema: remove contrato de componente reutilizado.
- Como Bugbot detecta: regex `function\\s+\\w+\\([^)]*: any\\)`.
- Severidade: 🟢

### Cicatriz 19
- Arquivo: `client/src/pages/Relatorios.tsx`
- Linha: `22,39,129,131`
- Tipo: 🧠
- Cicatriz: `any` em agregação/ordenação de relatórios.
- Commit que originou: `c70025b`
- Por que é problema: relatório aceita shape errado sem falhar em compile time.
- Como Bugbot detecta: regex `\\bany\\b` no arquivo.
- Severidade: 🟡

### Cicatriz 20
- Arquivo: `client/src/pages/Relatorios.tsx`
- Linha: `63`
- Tipo: ⚙️
- Cicatriz: exportação usa só `window.print()` (sem CSV/XLS/PDF real).
- Commit que originou: base `353a938`
- Por que é problema: botão “Exportar” promete mais do que entrega.
- Como Bugbot detecta: regex `Imprimir / Exportar` + `window\\.print\\(`.
- Severidade: 🟢

### Cicatriz 21
- Arquivo: `shared/schema.ts`
- Linha: `23`
- Tipo: 📊
- Cicatriz: `status_pagamento` em `text` livre, sem enum controlado.
- Commit que originou: `1fef74c`
- Por que é problema: valores inválidos entram e quebram filtros.
- Como Bugbot detecta: regex `status_.*:\\s*text\\(` sem enum/check.
- Severidade: 🟡

### Cicatriz 22
- Arquivo: `shared/schema.ts`
- Linha: `25`
- Tipo: 📊
- Cicatriz: `cliente_id` sem FK declarada no schema Drizzle.
- Commit que originou: base `353a938`
- Por que é problema: permite órfãos e inconsistência referencial.
- Como Bugbot detecta: `integer("cliente_id")` sem `.references(`.
- Severidade: 🟡

### Cicatriz 23
- Arquivo: `drizzle.config.ts`
- Linha: `8`
- Tipo: 🛡️
- Cicatriz: string com host real + placeholder de senha hardcoded.
- Commit que originou: `1fef74c`
- Por que é problema: incentiva copiar segredo em arquivo.
- Como Bugbot detecta: regex `postgresql://.*\\[SUA-SENHA\\]`.
- Severidade: 🔴

### Cicatriz 24
- Arquivo: `package.json`
- Linha: `9`
- Tipo: ⚙️
- Cicatriz: `start` depende de `dist/index.cjs`; risco se build parcial.
- Commit que originou: `fec2f95`
- Por que é problema: start sobe quebrado quando artefato não existe.
- Como Bugbot detecta: script `start` apontando arquivo único sem verificação prévia.
- Severidade: 🟡

### Cicatriz 25
- Arquivo: `package.json`
- Linha: `13-110`
- Tipo: 📦
- Cicatriz: ausência de script explícito `lint`, `test`, `audit`.
- Commit que originou: histórico base
- Por que é problema: PR passa sem guardrail automático.
- Como Bugbot detecta: parse `scripts` sem chaves `lint|test|audit`.
- Severidade: 🟡

### Cicatriz 26
- Arquivo: `railway.toml`
- Linha: `5`
- Tipo: ⚙️
- Cicatriz: deploy só com `npm run start`; sem `healthcheckPath` explícito.
- Commit que originou: base atual
- Por que é problema: troubleshooting de boot fica cego.
- Como Bugbot detecta: parse toml sem `healthcheckPath`.
- Severidade: 🟢

### Cicatriz 27
- Arquivo: `vercel.json`
- Linha: `2-4`
- Tipo: ⚙️
- Cicatriz: sem headers de segurança básicos no edge.
- Commit que originou: `9de7a10`
- Por que é problema: hardening web incompleto.
- Como Bugbot detecta: json sem bloco `headers`.
- Severidade: 🟢

### Cicatriz 28
- Arquivo: `server/index.ts`
- Linha: `20`
- Tipo: 🛡️
- Cicatriz: CORS aceita requisições sem `origin` sem discriminação.
- Commit que originou: `5763de4`
- Por que é problema: facilita chamadas automatizadas não esperadas.
- Como Bugbot detecta: regex `if \\(!origin\\) return cb\\(null, true\\)`.
- Severidade: 🟡

### Cicatriz 29
- Arquivo: `server/storage.ts`
- Linha: `121-123` e `155-157`
- Tipo: 🐛
- Cicatriz: deletes ignoram erro de banco (não validam response).
- Commit que originou: `02577a8`
- Por que é problema: UI pode mostrar “ok” sem deletar de verdade.
- Como Bugbot detecta: AST chamadas `delete()` sem checar `{ error }`.
- Severidade: 🟡

### Cicatriz 30
- Arquivo: `client/src/lib/queryClient.ts`
- Linha: `125,128`
- Tipo: ⚙️
- Cicatriz: `retry: false` global para query/mutation.
- Commit que originou: base `353a938`
- Por que é problema: perda de resiliência em falhas transitórias.
- Como Bugbot detecta: regex `retry:\\s*false` em `defaultOptions`.
- Severidade: 🟢

---

## Tarefa 2 — Varredura por Commit (últimos 50)

### Commits que fecharam cicatriz real
- `ee9f192`: blindagem JWT ES256 (portão auth).
- `02cfd78`: envio de Bearer no frontend.
- `0b27375`: validação Zod PATCH.
- `2e9be33`: correção de tipo `vendas.data`.
- `a566f0f` + `da0bb20`: build Railway com `tsx` em produção.

### Commits que deixaram dívida residual ativa
- `02577a8`: top-level throw no `storage.ts` + fallback de key ambíguo.
- `57f8e40`: parsing de data frágil por string em `Calendario`.
- `353a938` (blame base): múltiplos `any`, `confirm()`, parsing e falta de guardrails.

---

## Tarefa 3 — Varredura por Rota (`server/routes.ts`)

| Rota | Auth | Zod | Tratamento erro | Cicatriz |
|---|---|---|---|---|
| `GET /api/vendas` | Global (`server/index.ts`) | n/a | try/catch sem log | catch engole erro |
| `POST /api/vendas` | Global | `insertVendaSchema.safeParse` | try/catch sem log | retorno de erro cru |
| `PATCH /api/vendas/:id` | Global | `patchVendaSchema.safeParse` | try/catch sem log | `id` sem validação |
| `DELETE /api/vendas/:id` | Global | n/a | sem try/catch | risco de erro cru |
| `GET /api/clientes` | Global | n/a | try/catch sem log | observabilidade fraca |
| `POST /api/clientes` | Global | `insertClienteSchema.safeParse` | try/catch sem log | erro sem contexto |
| `PATCH /api/clientes/:id` | Global | `patchClienteSchema.safeParse` | try/catch sem log | `id` sem validação |
| `DELETE /api/clientes/:id` | Global | n/a | sem try/catch | retorno sempre `ok` |
| `GET /api/stats` | Global | n/a | try/catch sem log | falha sem diagnóstico |
| `POST /api/seed` | Global | n/a | try/catch sem log | endpoint técnico exposto |

---

## Tarefa 4 — Varredura por Tabela Supabase (schema + gaps)

| Tabela | Coluna crítica | Tipo Drizzle | Status | Observação |
|---|---|---|---|---|
| `clientes` | `id` | `serial` | OK | sem FK outbound |
| `clientes` | `nome` | `text not null` | OK | mínimo |
| `vendas` | `data` | `timestamp withTimezone` | OK | corrigido em `2e9be33` |
| `vendas` | `status_pagamento` | `text default` | ⚠️ | sem enum/check |
| `vendas` | `cliente_id` | `integer` | ⚠️ | sem `.references` |
| `contas_pagar` | n/a | n/a no `schema.ts` atual | 🔍 INVESTIGAR | existe no banco, não no schema compartilhado atual |
| `contas_receber` | n/a | n/a no `schema.ts` atual | 🔍 INVESTIGAR | idem |
| `lancamentos` | n/a | n/a no `schema.ts` atual | 🔍 INVESTIGAR | idem |

### Estado que precisa painel/SQL
- RLS ativo por tabela: 🔍 INVESTIGAR (via `pg_tables`, `pg_policies`).
- Índices `idx_*` em produção: 🔍 INVESTIGAR (via `pg_indexes`).
- FKs reais no banco: 🔍 INVESTIGAR (via `information_schema`).

---

## Tarefa 5 — Varredura de Dependências (`package.json`)

| Dependência | Seção | Uso real | Risco | Status |
|---|---|---|---|---|
| `tsx` | dependencies | build/dev runtime | quebra deploy se mover | OK (fixado em produção) |
| `typescript` | dependencies | build/check | quebra deploy se mover | OK |
| `@supabase/supabase-js` | dependencies | auth e client frontend | quebra auth/url | OK |
| `jose` | dependencies | validação JWT backend | crítico segurança | OK |
| `express-session`, `passport`, `passport-local`, `memorystore` | dependencies | sem uso visível nas rotas atuais | peso e superfície extra | ⚠️ |
| `@jridgewell/trace-mapping` | dependencies | indireto/transitivo | provável dependência órfã manual | ⚠️ |

### CVE / Latest
- CVEs detalhadas: 🔍 INVESTIGAR (rodar `npm audit` no CI).
- Defasagem de versão por pacote: 🔍 INVESTIGAR (renovate/dependabot).

---

## Tarefa 6 — Varredura de Variáveis de Ambiente

| Variável | Onde usa | Fallback | `.env.example` | Comportamento se faltar | Sensibilidade |
|---|---|---|---|---|---|
| `SUPABASE_URL` | `server/storage.ts`, `server/middleware/requireAuth.ts` | não | sim | throw em import | 🔴 |
| `SUPABASE_SERVICE_ROLE_KEY` | `server/storage.ts` | cai em `SUPABASE_SECRET_KEY` | sim | throw em import | 🔴 |
| `SUPABASE_SECRET_KEY` | `server/storage.ts` | fallback secundário | não | ambíguo | 🔴 |
| `NODE_ENV` | `server/index.ts` | default implícito | sim | muda modo vite/static | 🟡 |
| `PORT` | `server/index.ts` | `5000` | não | sobe porta default | 🟡 |
| `DATABASE_URL` | `drizzle.config.ts` | string hardcoded com placeholder | não | usa valor inseguro de exemplo | 🔴 |
| `VITE_SUPABASE_URL` | `client/lib/supabase.ts` | não | sim | quebra criação client | 🟡 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `client/lib/supabase.ts` | cai em ANON | sim | depende fallback | 🟡 |
| `VITE_SUPABASE_ANON_KEY` | `client/lib/supabase.ts` | legado | não (como chave principal) | compat legado | 🟢 |
| `VITE_API_BASE_URL` | `client/lib/queryClient.ts` | `""` + fallback same-origin | sim | comportamento ambíguo | 🟡 |

---

## Tarefa 7 — 5 Padrões de Bug Recorrente (com regra nova)

### Padrão R1 — Queda total por env faltando no import
- Evidência: `server/middleware/requireAuth.ts:6-8@ee9f192`, `server/storage.ts:7-9@02577a8`
- Regra nova: bloquear `throw` top-level em módulos de bootstrap.

### Padrão R2 — Data tratada como string livre no frontend
- Evidência: `client/src/pages/Calendario.tsx:99-100@57f8e40`, `Relatorios.tsx:23@353a938`
- Regra nova: obrigar util central `parseISO`/normalizador de data.

### Padrão R3 — Erro engolido em backend
- Evidência: múltiplos `catch (e)` sem log em `server/routes.ts@9de7a10`
- Regra nova: `catch` obrigatório com `console.error` + contexto.

### Padrão R4 — `any` em fronteira de domínio
- Evidência: `Vendas.tsx`, `Relatorios.tsx`, `storage.ts`, `index.ts`
- Regra nova: bloquear `any` em arquivos de rota, storage e páginas core.

### Padrão R5 — Config de deploy “passa local, quebra cloud”
- Evidência: saga `a566f0f`, `da0bb20`, warning atual de env/build
- Regra nova: check CI de scripts + smoke de boot (`/api/health`) antes merge.

---

## Tarefa 8 — Regras que a Perplexity não viu (NOVAS)

> Abaixo: 32 regras novas para Bugbot (não repetem as do `BUGBOT.md` base).

### N1
- Regra: Proibir `JSON.stringify(capturedJsonResponse)` em logs de `/api/*`.
- Evidência: `server/index.ts:73@1fef74c`
- Detector: regex `JSON\\.stringify\\(capturedJsonResponse\\)`.
- Severidade: 🔴

### N2
- Regra: `catch` em `server/routes.ts` deve registrar erro com contexto da rota.
- Evidência: `server/routes.ts:11,16,28,35,40,52,59,69@9de7a10`
- Detector: AST `CatchClause` sem `console.error`.
- Severidade: 🟡

### N3
- Regra: Toda rota com `:id` deve validar `id` numérico antes de chamar storage.
- Evidência: `server/routes.ts:19,31,43,55`
- Detector: regex `parseInt\\(` sem `Number.isFinite`.
- Severidade: 🟡

### N4
- Regra: `DELETE` handlers precisam `try/catch` + retorno de erro padronizado.
- Evidência: `server/routes.ts:30-33`
- Detector: AST rota `delete` sem `try`.
- Severidade: 🟡

### N5
- Regra: `storage.delete*` deve checar `{ error }` retornado pelo Supabase.
- Evidência: `server/storage.ts:121-123`, `155-157`
- Detector: AST `await supabase...delete()` sem leitura de `error`.
- Severidade: 🟡

### N6
- Regra: `SUPABASE_SECRET_KEY` não pode coexistir como fallback de service role.
- Evidência: `server/storage.ts:5@02577a8`
- Detector: regex `SUPABASE_SECRET_KEY`.
- Severidade: 🔴

### N7
- Regra: bloquear `any` em `server/index.ts`, `server/routes.ts`, `server/storage.ts`.
- Evidência: `server/index.ts:60,88,93`, `server/storage.ts:13,33,102,146`
- Detector: regex `\\bany\\b`.
- Severidade: 🟡

### N8
- Regra: Em `client/src/lib/supabase.ts`, validar envs antes de `createClient`.
- Evidência: `client/src/lib/supabase.ts:3-7`
- Detector: `createClient(` sem `if (!supabaseUrl || !supabaseKey)`.
- Severidade: 🟡

### N9
- Regra: evitar fallback duplo de API base (`[getApiBase(), ""]`) em produção.
- Evidência: `client/src/lib/queryClient.ts:55,90@ad8a3a2`
- Detector: regex `new Set\\(\\[getApiBase\\(\\),\\s*\"\"\\]\\)`.
- Severidade: 🟡

### N10
- Regra: `queryFn` deve suportar `204`/não-JSON.
- Evidência: `client/src/lib/queryClient.ts:114-115`
- Detector: AST `res.json()` sem check de status/content-type.
- Severidade: 🟢

### N11
- Regra: proibir `useState<any>` nas páginas core.
- Evidência: `client/src/pages/Vendas.tsx:660`, `Clientes.tsx:10`
- Detector: regex `useState<any>`.
- Severidade: 🟡

### N12
- Regra: proibir `mutationFn: (data: any)` em mutations de domínio.
- Evidência: `Vendas.tsx:815,827`
- Detector: regex `mutationFn:\\s*\\([^)]*any`.
- Severidade: 🟡

### N13
- Regra: remover `confirm()` nativo; usar modal de UI.
- Evidência: `Vendas.tsx:1011@353a938`
- Detector: regex `\\bconfirm\\(`.
- Severidade: 🟢

### N14
- Regra: proibir parse de data por `substring`/`startsWith` em campos de timestamp.
- Evidência: `Calendario.tsx:99-100`, `185-186`, `299-300`
- Detector: regex `\\.data\\.(startsWith|substring)`.
- Severidade: 🟡

### N15
- Regra: criar util único `toLocalDate()` para renderização de datas.
- Evidência: `Vendas.tsx:965`, `Relatorios.tsx:23`, `Calendario.tsx:*`
- Detector: múltiplos padrões de parse espalhados.
- Severidade: 🟡

### N16
- Regra: `Relatorios` não pode usar `any` em agregação.
- Evidência: `Relatorios.tsx:22,39,129,131`
- Detector: regex `\\bany\\b` no arquivo.
- Severidade: 🟡

### N17
- Regra: botão com label “Exportar” deve gerar arquivo real (csv/xlsx/pdf).
- Evidência: `Relatorios.tsx:63` (`window.print`).
- Detector: regex `Exportar` + ausência de geração blob/download.
- Severidade: 🟢

### N18
- Regra: `status_pagamento` deve ser enum de banco + Zod enum.
- Evidência: `shared/schema.ts:23@1fef74c`
- Detector: coluna status em `text(` sem enum.
- Severidade: 🟡

### N19
- Regra: colunas `*_id` devem ter `.references` no Drizzle ou justificativa.
- Evidência: `shared/schema.ts:25`
- Detector: regex `integer\\(\".*_id\"\\)` sem `.references`.
- Severidade: 🟡

### N20
- Regra: cada tabela de domínio nova precisa schema + rota + migration no mesmo PR.
- Evidência: divergência atual entre tabelas citadas (`contas_*`, `lancamentos`) e schema ativo.
- Detector: diff adiciona tabela em docs/migration sem refletir no schema compartilhado.
- Severidade: 🔴

### N21
- Regra: `drizzle.config.ts` não pode conter string de conexão com host real.
- Evidência: `drizzle.config.ts:8@1fef74c`
- Detector: regex `postgresql://.*supabase\\.co`.
- Severidade: 🔴

### N22
- Regra: exigir `healthcheckPath="/api/health"` no `railway.toml`.
- Evidência: arquivo sem healthcheck explícito.
- Detector: parse toml sem chave healthcheck.
- Severidade: 🟢

### N23
- Regra: exigir script `lint` e `test` no `package.json`.
- Evidência: `package.json:scripts` sem ambos.
- Detector: parse json faltando keys.
- Severidade: 🟡

### N24
- Regra: bloquear dependências aparentemente órfãs em auth legado (`passport*`, `express-session`) sem uso em rotas.
- Evidência: dependências presentes sem referência em `server/routes.ts`.
- Detector: pacote instalado sem matches no repo (`rg`).
- Severidade: 🟢

### N25
- Regra: bloquear qualquer `console.log` de payload em ambiente produção.
- Evidência: logger geral de API no backend.
- Detector: regex `console\\.log\\(` + `NODE_ENV=production`.
- Severidade: 🟡

### N26
- Regra: `PORT` não pode ter fallback silencioso em produção.
- Evidência: `server/index.ts:120`
- Detector: regex `process\\.env\\.PORT\\s*\\|\\|`.
- Severidade: 🟢

### N27
- Regra: resposta de erro de API deve incluir `requestId` padronizado.
- Evidência: handlers atuais retornam só `{ error }`.
- Detector: respostas de erro sem campo `requestId`.
- Severidade: 🟡

### N28
- Regra: endpoint técnico `/api/seed` deve ser protegido por `NODE_ENV !== 'production'`.
- Evidência: `server/routes.ts:61-69`
- Detector: presença de `/api/seed` sem guard de ambiente.
- Severidade: 🔴

### N29
- Regra: proibir regex de parsing de mensagem de erro no frontend.
- Evidência: `Vendas.tsx:286-287`
- Detector: regex `error\\.message\\.match\\(`.
- Severidade: 🟢

### N30
- Regra: função de data deve usar `Date` seguro (sem concat string de horário fixo).
- Evidência: `Vendas.tsx:965`
- Detector: regex `\\+\\s*\"T12:00:00\"`.
- Severidade: 🟡

### N31
- Regra: obrigar tipagem explícita para componentes utilitários (`StatCard`, `Section`, etc.).
- Evidência: `Calendario.tsx:37`, `Configuracoes.tsx` (padrão semelhante).
- Detector: regex `function\\s+\\w+\\(\\{[^}]+\\}: any\\)`.
- Severidade: 🟢

### N32
- Regra: bloquear merge se existir `🔍 INVESTIGAR` de segurança/build sem task aberta.
- Evidência: gaps atuais de RLS/FK/CVE/healthcheck.
- Detector: scan markdown de auditoria + validação issue vinculada.
- Severidade: 🔴

---

## Lista objetiva de INVESTIGAR (para Perplexity complementar)

1. Confirmar RLS ativo nas tabelas reais (`clientes`, `vendas`, `contas_pagar`, `contas_receber`, `lancamentos`).
2. Confirmar FKs reais no banco (`vendas.cliente_id` etc.).
3. Confirmar índices `idx_*` no ambiente produção atual.
4. Rodar `npm audit` e mapear CVEs com prioridade de patch.
5. Verificar se dependências de auth legado (`passport`, `express-session`) podem ser removidas.
6. Validar necessidade de endpoint `/api/seed` em produção.
7. Definir política de redaction de logs (`PII` e payloads).

---

## Resumo Executivo

- Foram identificadas **30 cicatrizes técnicas** com vínculo de arquivo/linha e commit para as mais críticas.
- Foram geradas **32 regras novas** para Bugbot além do baseline da Perplexity.
- Raízes recorrentes continuam em 5 frentes: **boot por env**, **datas frágeis**, **erro engolido**, **tipagem frouxa** e **guardrails de deploy**.
- Estado atual é melhor que o início, mas ainda há risco operacional se essas regras não forem automatizadas no PR.
