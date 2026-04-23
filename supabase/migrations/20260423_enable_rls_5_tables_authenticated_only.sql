-- Migration: enable_rls_5_tables_authenticated_only
-- Aplicada em producao em 2026-04-23 via Supabase MCP
-- Objetivo: zerar os 7 alertas criticos de seguranca (RLS desligado)
--
-- O que faz:
-- 1. Remove 2 politicas orfas abertas ("permitir tudo")
-- 2. Liga RLS nas 5 tabelas do core financeiro
-- 3. Cria politica minima: somente usuarios autenticados leem/escrevem
--
-- Proximo passo futuro (nao agora): refinar as politicas pra escopo por usuario/empresa
-- quando o auth de verdade estiver ativo.

-- 1) Remove policies orfas abertas que existiam antes
DROP POLICY IF EXISTS "permitir tudo clientes" ON public.clientes;
DROP POLICY IF EXISTS "permitir tudo vendas" ON public.vendas;

-- 2) Liga RLS nas 5 tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- 3) Politicas minimas: somente usuario autenticado le e escreve
CREATE POLICY "authenticated_all_clientes"       ON public.clientes       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_vendas"         ON public.vendas         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_contas_pagar"   ON public.contas_pagar   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_contas_receber" ON public.contas_receber FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_lancamentos"    ON public.lancamentos    FOR ALL TO authenticated USING (true) WITH CHECK (true);
