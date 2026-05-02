# Etapa Railway Fix - Node 22 (evidencia)

**Data:** 2026-05-02  
**Projeto:** Sistema-Financeiro-Geral  
**Ambiente:** Railway / production  
**Responsavel:** Cursor (com aprovacao do Gabriel)

## Problema

Deploy em crash continuo no Railway com erro:

`ERR_REQUIRE_ESM: require() of ES Module jose ... from dist/index.cjs`

Contexto observado no log:
- runtime antigo (`Node.js v20.18.1`)
- bundle do servidor em CommonJS (`dist/index.cjs`)
- dependencia `jose` em formato ESM no runtime

## Causa raiz

Mismatch entre runtime e carga de modulo no ambiente de producao.

Em resumo: build gerava CJS e o runtime antigo quebrava ao carregar `jose` ESM.

## Correcao aplicada

### 1) Forcar Node 22 no build/runtime Railway

- `.node-version` -> `22.12.0`
- `nixpacks.toml` criado com:

```toml
[phases.setup]
nixPkgs = ["nodejs_22", "npm-10_x", "openssl"]
```

### 2) Restaurar build de producao

No `script/build.ts`:
- `minify: true`
- `sourcemap: true` (externo)

### 3) Commit de fix principal

- **Hash:** `6d90040`
- **Mensagem:** `fix(railway): forcar Node 22 e restaurar build de producao`

## Validacao objetiva apos fix

### Railway

- Deploy: `3b83d912-a46d-46a9-ae2b-6234a6c5c36f`
- Status: `SUCCESS`
- Log de boot:
  - `cross-env NODE_ENV=production node dist/index.cjs`
  - `[express] serving on port 8080`

### HTTP (producao)

- `GET /api/health` -> `200` (`{"ok":true}`)
- `GET /api/vendas` sem token -> `401` (`Token ausente`)
- `GET /api/vendas` token fake -> `401` (`Token invalido ou expirado`)

## Estabilizacao complementar da varredura

Durante a auditoria completa, foram encontrados e corrigidos erros de tipagem de data (`Date` x `string`) em:
- `client/src/pages/Calendario.tsx`
- `server/storage.ts`

Commit complementar:
- **Hash:** `4307fe4`
- Deploy Railway: `fd9ede77-e179-49c2-bb7f-907b2a6c2713` (`SUCCESS`)

## Limpeza operacional no Railway

Servicos duplicados foram removidos no painel:
- `easygoing-celebration`
- `ravishing-achievement`

Estado final no projeto Railway:
- apenas `Sistema-Financeiro-Geral` ativo
- `0` warnings / `0` critical
- `1/1` replica online

## Regra permanente para nao regredir

Antes de qualquer mudanca em auth/deploy:
1. `npm run check`
2. `npm run build`
3. Confirmar `.node-version = 22.12.0`
4. Confirmar `nixpacks.toml` com `nodejs_22`
5. Validar em producao: `/api/health` 200 + rota protegida 401
