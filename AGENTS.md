# AGENTS.md — Sistema Financeiro Geral

> Documento constitucional lido por todos os agentes (Background Agent, Composer, Cursor CLI, Claude Code).
> Padrão aberto AGENTS.md (Linux Foundation, 2026). Suporta nesting em subdiretórios.

## Contexto do projeto

ERP em construção da **Patrocínio Café** (Goiânia-GO).
**Dono:** Gabriel Novak (Judson Gabriell Martins) — perfil não-técnico, depende de orientação clique-a-clique.
**Repositório:** `gabriellnovak2-max/Sistema-Financeiro-Geral` (branch `main` protegida).
**Fase atual:** Fase 1 — Blindagem (core concluído: 1.1, 1.2, 1.3, 1.4, 1.5, 1.9, 1.10).
**Próxima:** Fase 2 — Financeiro, Etapa 2.1 (Plano de contas + Centro de custo).

## Stack canônico (NÃO TROCAR sem ordem explícita do Gabriel)

- **Frontend:** React 18 + TypeScript 5.x (strict) + Vite 7 + Tailwind v3 + shadcn/ui + wouter
- **HTTP client:** TanStack Query via `client/src/lib/queryClient.ts`
- **Backend:** Node.js 22.x + Express 5 + Drizzle ORM + Zod + `jose` (JWT ES256)
- **Banco:** Supabase Postgres (project `ekmjyubgknfssoqafxri`) com RLS em todas as 5 tabelas core
- **Deploy:** Vercel (frontend) + Railway (backend Express via Nixpacks `nodejs_22`)
- **VCS:** GitHub, branch `main` protegida (Branch Protection ativo)

## Regras de ouro (NÃO NEGOCIÁVEIS)

1. **NUNCA** `git push --force`, `git reset --hard`, `git push origin main` direto.
2. **NUNCA** editar `.env`, `.env.local`, `.env.*` ou qualquer arquivo com secret/credential.
3. **NUNCA** rodar `rm -rf` em qualquer caminho fora do workspace do projeto.
4. **NUNCA** chamar API destrutiva do Railway (delete volume, delete service, delete project) — mesmo que pareça "limpar staging". Caso PocketOS (abr/2026) é o lembrete.
5. **SEMPRE** abrir PR; **NUNCA** commitar direto em `main`.
6. **SEMPRE** rodar `npm run build` E `npm run check` antes de marcar tarefa como concluída.
7. **SEMPRE** perguntar antes de instalar dependência nova — **NUNCA** "guess" para resolver erro.
8. Se encontrar credential mismatch ou erro de auth, **PARAR** e abrir PR descrevendo o problema. **NUNCA** "consertar" deletando recursos.
9. **SEMPRE** seguir Ordem Sagrada do roadmap (`docs/cerebro-portatil/ROADMAP-CANONICO-59-MAIS.md`). Não pular fase.
10. **SEMPRE** que afirmar fato externo (alíquota fiscal, prazo SEFAZ, preço de API), citar fonte oficial atual.

## Comandos canônicos

| Tarefa | Comando |
|---|---|
| Setup inicial | `npm install` |
| Dev (frontend + backend integrado) | `npm run dev` |
| Build de produção | `npm run build` |
| Type check | `npm run check` |
| Smoke test deploy local | `node -v && cat nixpacks.toml` |
| Health check produção | `curl https://sistema-financeiro-geral-production.up.railway.app/api/health` |

## Estado conhecido (atualizado 02/05/2026)

- Railway estável após fix `ERR_REQUIRE_ESM` (commit `6d90040`): Node 22 forçado via `nixpacks.toml` (`nodejs_22`) + `.node-version` `22.12.0`.
- Build de produção: `script/build.ts` com `minify: true`, `sourcemap: true` (externo).
- Endpoints validados em produção: `/api/health` 200, `/api/vendas` sem token 401, com token fake 401.
- Serviços duplicados Railway (`easygoing-celebration`, `ravishing-achievement`) **removidos** definitivamente em 02/05/2026.
- Apenas serviço `Sistema-Financeiro-Geral` ativo no projeto Railway `carefree-dream`.

## TypeScript em dependências — ATENÇÃO

`tsx`, `typescript`, `@types/node`, `esbuild`, `vite`, `cross-env` estão em `dependencies` (não `devDependencies`) porque o build do Railway pula `devDependencies` em produção. Se mover de volta, build quebra.

## Migrations Supabase

- **NUNCA** rodar `supabase db reset` em produção.
- Sempre criar migration via arquivo em `supabase/migrations/` + PR.
- RLS por `user_id` e/ou `empresa_id` (ainda só `authenticated_all_*`; refinar quando entrar multi-tenant).
- `service_role key` vai em variável de ambiente do Railway, **NUNCA** em `.env` commitada.

## Antes de marcar pronto (checklist obrigatório)

- [ ] `npm run check` passa
- [ ] `npm run build` passa
- [ ] Sem nova dependência (ou justificativa clara no PR)
- [ ] Sem alteração em `.env*` ou `nixpacks.toml` ou `.node-version` sem aprovação explícita
- [ ] Hash do commit registrado e push validado em `origin/main`
- [ ] Endpoint de produção validado (`/api/health` 200) quando alteração afeta backend

## Comunicação com Gabriel (estilo obrigatório)

- PT-BR informal, direto, sem yes-man.
- Chamar de **Gabriel** ou **Visionário**.
- Explicar **o que + por quê + exemplo do dia-a-dia** (analogia de café/padaria/posto, nunca de amizade).
- Quebrar resposta longa em etapas, pedir "ok" antes de avançar.
- Sempre terminar com tabela `Concluído / Pendente / Prova objetiva`.
- Se houver commit, sempre informar hash e branch.

## Documentos de referência (cérebro do projeto)

- `docs/cerebro/00-indice-operacional.md` — índice
- `docs/cerebro/01-contexto-e-objetivo.md` — quem é Gabriel + meta do sistema
- `docs/cerebro/02-ordem-sagrada.md` — ordem das fases
- `docs/cerebro/03-alertas-criticos-fase1.md` — alertas críticos
- `docs/cerebro/04-protocolo-pesquisa-antes.md` — pesquisar antes de alterar
- `docs/cerebro-fiscal.md` — cérebro fiscal completo (NF-e, NFC-e, Reforma Tributária)
- `docs/cerebro-portatil/ROADMAP-CANONICO-59-MAIS.md` — roadmap canônico oficial (59+)
- `docs/cerebro-portatil/MATRIZ-EQUIVALENCIA-ROADMAP.md` — equivalência legado 49/52/55 -> canônico
- `docs/cerebro-portatil/ROADMAP-49-ETAPAS-V2-SUPERPODERES.md` — roadmap legado detalhado (preservado)
- `.cursor/BUGBOT.md` — regras de revisão automática (Bugbot)
- `.cursor/rules/*.mdc` — regras técnicas por domínio

## Quando AGENTS.md aninhado se aplica

Se houver `AGENTS.md` em subdiretório (ex: `server/AGENTS.md`), o agente lê o **mais próximo** do arquivo que está editando. Hoje o repo só tem este AGENTS.md raiz.
