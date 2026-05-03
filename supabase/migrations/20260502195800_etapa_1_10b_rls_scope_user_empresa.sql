-- ============================================================
-- Etapa 1.10B - RLS por escopo (user_id / empresa_id)
-- Data: 2026-05-02
-- Tipo: incremental e idempotente (sem DROP destrutivo)
--
-- Objetivo:
-- 1) Evitar acesso cruzado entre usuarios/empresas no role authenticated
-- 2) Preparar schema para escopo por owner (user_id) e tenant (empresa_id)
-- 3) Manter compatibilidade com backend atual (service role)
-- ============================================================

BEGIN;

-- Funcao utilitaria para ler empresa_id do JWT com parse seguro.
CREATE OR REPLACE FUNCTION public.current_empresa_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claim_value text;
BEGIN
  claim_value := nullif(auth.jwt() ->> 'empresa_id', '');

  IF claim_value IS NULL THEN
    RETURN NULL;
  END IF;

  BEGIN
    RETURN claim_value::uuid;
  EXCEPTION
    WHEN others THEN
      RETURN NULL;
  END;
END;
$$;

-- 1) Colunas de escopo (compatibilidade futura com multi-tenant e ownership)
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS empresa_id uuid;

ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS empresa_id uuid;

ALTER TABLE public.contas_pagar ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.contas_pagar ADD COLUMN IF NOT EXISTS empresa_id uuid;

ALTER TABLE public.contas_receber ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.contas_receber ADD COLUMN IF NOT EXISTS empresa_id uuid;

ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS empresa_id uuid;

-- Defaults apenas para novas linhas inseridas via role authenticated.
ALTER TABLE public.clientes ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.clientes ALTER COLUMN empresa_id SET DEFAULT public.current_empresa_id();

ALTER TABLE public.vendas ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.vendas ALTER COLUMN empresa_id SET DEFAULT public.current_empresa_id();

ALTER TABLE public.contas_pagar ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.contas_pagar ALTER COLUMN empresa_id SET DEFAULT public.current_empresa_id();

ALTER TABLE public.contas_receber ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.contas_receber ALTER COLUMN empresa_id SET DEFAULT public.current_empresa_id();

ALTER TABLE public.lancamentos ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.lancamentos ALTER COLUMN empresa_id SET DEFAULT public.current_empresa_id();

-- 2) Indices para filtro por escopo
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_id ON public.clientes(empresa_id);

CREATE INDEX IF NOT EXISTS idx_vendas_user_id ON public.vendas(user_id);
CREATE INDEX IF NOT EXISTS idx_vendas_empresa_id ON public.vendas(empresa_id);

CREATE INDEX IF NOT EXISTS idx_contas_pagar_user_id ON public.contas_pagar(user_id);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_empresa_id ON public.contas_pagar(empresa_id);

CREATE INDEX IF NOT EXISTS idx_contas_receber_user_id ON public.contas_receber(user_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_empresa_id ON public.contas_receber(empresa_id);

CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_empresa_id ON public.lancamentos(empresa_id);

-- Expressao de escopo alvo:
-- - acesso por dono da linha (user_id = auth.uid())
-- - OU por tenant da linha (empresa_id = claim empresa_id do JWT)
-- Linhas sem escopo preenchido nao sao visiveis para authenticated.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clientes'
      AND policyname = 'authenticated_all_clientes'
  ) THEN
    EXECUTE $sql$
      ALTER POLICY "authenticated_all_clientes"
      ON public.clientes
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "authenticated_all_clientes"
      ON public.clientes
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'vendas'
      AND policyname = 'authenticated_all_vendas'
  ) THEN
    EXECUTE $sql$
      ALTER POLICY "authenticated_all_vendas"
      ON public.vendas
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "authenticated_all_vendas"
      ON public.vendas
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contas_pagar'
      AND policyname = 'authenticated_all_contas_pagar'
  ) THEN
    EXECUTE $sql$
      ALTER POLICY "authenticated_all_contas_pagar"
      ON public.contas_pagar
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "authenticated_all_contas_pagar"
      ON public.contas_pagar
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contas_receber'
      AND policyname = 'authenticated_all_contas_receber'
  ) THEN
    EXECUTE $sql$
      ALTER POLICY "authenticated_all_contas_receber"
      ON public.contas_receber
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "authenticated_all_contas_receber"
      ON public.contas_receber
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lancamentos'
      AND policyname = 'authenticated_all_lancamentos'
  ) THEN
    EXECUTE $sql$
      ALTER POLICY "authenticated_all_lancamentos"
      ON public.lancamentos
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "authenticated_all_lancamentos"
      ON public.lancamentos
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
      WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
          (user_id IS NOT NULL AND user_id = auth.uid())
          OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id())
        )
      )
    $sql$;
  END IF;
END $$;

COMMIT;
