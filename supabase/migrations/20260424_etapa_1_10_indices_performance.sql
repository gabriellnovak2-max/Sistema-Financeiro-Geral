-- ============================================================
-- Etapa 1.10 — Índices de Performance
-- Aplicada originalmente em: 2026-04-23 via Supabase MCP
-- Migração idempotente (CREATE INDEX IF NOT EXISTS)
-- Contexto: fechar Fase 1 (Blindagem) do Sistema-Financeiro-Geral
-- ============================================================

-- vendas (3 índices)
CREATE INDEX IF NOT EXISTS idx_vendas_cliente_id
  ON public.vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_data
  ON public.vendas(data DESC);
CREATE INDEX IF NOT EXISTS idx_vendas_status_pagamento
  ON public.vendas(status_pagamento);

-- contas_pagar (2 índices)
CREATE INDEX IF NOT EXISTS idx_contas_pagar_data_vencimento
  ON public.contas_pagar(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_status
  ON public.contas_pagar(status);

-- contas_receber (4 índices)
CREATE INDEX IF NOT EXISTS idx_contas_receber_cliente_id
  ON public.contas_receber(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_venda_id
  ON public.contas_receber(venda_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_data_vencimento
  ON public.contas_receber(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_receber_status
  ON public.contas_receber(status);

-- lancamentos (2 índices)
CREATE INDEX IF NOT EXISTS idx_lancamentos_data_lancamento
  ON public.lancamentos(data_lancamento DESC);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo
  ON public.lancamentos(tipo);
