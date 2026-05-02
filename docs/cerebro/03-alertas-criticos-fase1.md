# ALERTAS CRITICOS - FASE 1

## ALERTA 1 (critico)
Se `apiRequest` mudar assinatura, atualizar no mesmo patch os chamadores que fazem `.json()`.
Pontos ja vistos: Dashboard e Metas.

## ALERTA 2 (importante)
JWT no Express sozinho nao fecha todos os bypass.
Ainda existe risco enquanto chamadas diretas no frontend para Supabase nao forem aposentadas.

## ALERTA 3 (importante)
RLS precisa ser por `empresa_id` e/ou `user_id`.
Policy aberta de autenticado sem recorte = risco de vazamento cruzado.

## ALERTA 4 (importante)
Nao assumir fatos externos (NT, data de obrigacao, preco de API) sem fonte oficial atual.

## ALERTA 5 (migracao)
Mudanca `text -> date` e sensivel. Exigir backup, plano de rollback e janela controlada.

## ALERTA 6 (deploy/railway)
`jose` em runtime com bundle CommonJS pode quebrar em Node antigo com `ERR_REQUIRE_ESM`.
Padrao obrigatorio para producao Railway:
- `.node-version` em `22.12.0`
- `nixpacks.toml` forcando `nodejs_22`
- validar deploy com prova objetiva: `/api/health` 200 e rota protegida 401
