---
name: fix-railway-deploy
description: Diagnostica e corrige falha de deploy no Railway (502, build error, ERR_REQUIRE_ESM, port binding). Use quando deploy falhar ou app crashar em producao.
---

# Fix Railway Deploy

## Quando usar
- Deploy Railway com status `CRASHED`, `FAILED` ou `BUILDING` travado
- HTTP 502 em produção
- Log mostra `ERR_REQUIRE_ESM`, `Cannot find module`, `Application failed to respond`

## Runbook (sempre nessa ordem)

### 1. Diagnóstico via MCP
Usar `user-railway` MCP para listar deploys recentes:
- Project ID: `8c12bb13-99dc-4153-96f9-6ca5c7fb0210`
- Service ID Sistema-Financeiro-Geral: `f4e4f912-1fc6-4232-98a5-f23079ccf261`
- Environment ID production: `4022427c-fbaf-4e26-9849-8a666aea2c80`

Comando MCP: `railway-agent` com mensagem "Diagnose latest deployment for Sistema-Financeiro-Geral, return crash logs and root cause".

### 2. Classificar erro

| Sintoma no log | Causa provável | Fix |
|---|---|---|
| `ERR_REQUIRE_ESM` em `jose` | Node < 22.12 no runtime | Conferir `.node-version` = `22.12.0` e `nixpacks.toml` com `nodejs_22` |
| `Cannot find module 'tsx'` | tsx em devDependencies | Mover para `dependencies` |
| `Application failed to respond` | `throw` top-level no boot | Trocar por `console.error` + 503 nas rotas |
| `SUPABASE_URL ausente` | env var não setada no painel Railway | Adicionar via painel + redeploy |
| `Port 5000 already in use` | `reusePort: true` em `httpServer.listen` | Remover (Railway Linux não suporta bem) |

### 3. Validar fix em produção
```bash
curl -sS -w "\n%{http_code}\n" https://sistema-financeiro-geral-production.up.railway.app/api/health
# esperado: {"ok":true} 200

curl -sS -w "\n%{http_code}\n" https://sistema-financeiro-geral-production.up.railway.app/api/vendas
# esperado: {"error":"Token ausente"} 401
```

### 4. Documentar
Atualizar/criar `docs/etapas/ETAPA-RAILWAY-FIX-<descricao>.md` com:
- Sintoma original
- Causa raiz
- Patch aplicado (commit hash)
- Prova objetiva (curl + status do deploy)

## NUNCA
- Chamar API destrutiva do Railway (delete volume/service/project)
- Forçar push em main
- Aplicar fix sem validar com curl

## Referências
- `.cursor/rules/02-railway-deploy.mdc`
- `docs/etapas/ETAPA-RAILWAY-FIX-NODE22.md`
- `.cursor/BUGBOT.md` Categoria 4 (Build/Deploy)
