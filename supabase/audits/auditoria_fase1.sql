-- ============================================================
-- Auditoria Fase 1 — conferir RLS + índices em qualquer ambiente
-- Uso: rodar no SQL Editor do Supabase ou via psql
-- ============================================================

-- 1) Políticas RLS ativas
SELECT schemaname, tablename, policyname, cmd, roles, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 2) RLS habilitado em cada tabela
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3) Índices criados (apenas os customizados, ignorando pkeys)
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 4) Conferência esperada Fase 1.10:
--    11 índices idx_*, distribuídos assim:
--    vendas: 3, contas_pagar: 2, contas_receber: 4, lancamentos: 2
