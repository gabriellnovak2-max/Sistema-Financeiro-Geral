# Etapa 1.10 — Evidência de Conclusão

**Data:** 2026-04-23
**Responsável:** Perplexity (via Supabase MCP), autorizado por Gabriel
**Fase:** 1 (Blindagem) — etapa final

## O que foi feito

### RLS (Row Level Security)
Já estava ligado em todas as 5 tabelas `public.*` antes desta etapa:

| Tabela | RLS | Policy |
|---|---|---|
| clientes | ✅ | `authenticated_all_clientes` (ALL, role=authenticated, qual=true) |
| vendas | ✅ | `authenticated_all_vendas` |
| contas_pagar | ✅ | `authenticated_all_contas_pagar` |
| contas_receber | ✅ | `authenticated_all_contas_receber` |
| lancamentos | ✅ | `authenticated_all_lancamentos` |

**Decisão:** manter política permissiva para usuário autenticado (projeto monousuário). Revisar em futuro multitenant.

### Índices de performance (11 novos)

| Tabela | Índice | Coluna |
|---|---|---|
| vendas | `idx_vendas_cliente_id` | cliente_id |
| vendas | `idx_vendas_data` | data DESC |
| vendas | `idx_vendas_status_pagamento` | status_pagamento |
| contas_pagar | `idx_contas_pagar_data_vencimento` | data_vencimento |
| contas_pagar | `idx_contas_pagar_status` | status |
| contas_receber | `idx_contas_receber_cliente_id` | cliente_id |
| contas_receber | `idx_contas_receber_venda_id` | venda_id |
| contas_receber | `idx_contas_receber_data_vencimento` | data_vencimento |
| contas_receber | `idx_contas_receber_status` | status |
| lancamentos | `idx_lancamentos_data_lancamento` | data_lancamento DESC |
| lancamentos | `idx_lancamentos_tipo` | tipo |

## Como foi aplicado

- Originalmente via **Supabase MCP** (migration `etapa_1_10_indices_performance`)
- Versionado neste repo em `supabase/migrations/20260424_etapa_1_10_indices_performance.sql` (idempotente)

## Como auditar

Rodar `supabase/audits/auditoria_fase1.sql` no SQL Editor. Esperado: **11 índices `idx_*` + 5 policies `authenticated_all_*`**.

## Como reproduzir em ambiente novo

```bash
# Supabase CLI (se estiver conectado ao projeto)
supabase db push

# Ou manualmente, rodando o SQL em supabase/migrations/20260424_etapa_1_10_indices_performance.sql
```

## Fechamento Fase 1

| # | Etapa | Commit | Status |
|---|---|---|---|
| 1.1 | JWT ES256 backend | ee9f192 | 🟢 |
| 1.2 | Frontend Bearer | 02cfd78 | 🟢 |
| 1.3 | Zod nos PATCH | 0b27375 | 🟢 |
| 1.4 | Aposentar db.ts | 93ef74e | 🟢 |
| 1.5 | PUBLISHABLE_KEY | 00124ad | 🟢 |
| 1.9 | Schema data timestamp | 2e9be33 | 🟢 |
| 1.10 | RLS + 11 índices | (este commit) | 🟢 |

Etapas 1.6/1.7/1.8 (Produtos, Metas, Config) adiadas para **Fase 2 (Financeiro)** — dependiam de tabelas ainda inexistentes.
