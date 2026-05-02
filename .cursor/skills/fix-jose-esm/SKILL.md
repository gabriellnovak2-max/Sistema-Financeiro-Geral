---
name: fix-jose-esm
description: Corrige ERR_REQUIRE_ESM quando jose (ESM-only) e carregado em CJS ou Node antigo. Use sempre que ver esse erro no log.
---

# Fix `jose` ESM

## Sintoma
```
Error [ERR_REQUIRE_ESM]: require() of ES Module /app/node_modules/jose/dist/webapi/index.js
from /app/dist/index.cjs not supported.
```

## Causa
`jose` v5+ é **ESM-only**. `require('jose')` em código CJS funciona apenas em Node `^20.19 || ^22.12 || >=23`.
Node 20.18.x ou inferior **não tem** `require(esm)` habilitado por padrão.

## Fix permanente (já aplicado em prod, commit `6d90040`)

### `.node-version`
```
22.12.0
```

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_22", "npm-10_x", "openssl"]
```

## Validação
```bash
node -v   # esperado: v22.12.0 ou superior
node -e "import('jose').then(j => console.log('jose OK:', Object.keys(j).length))"
```

## NUNCA
- Downgrade `jose` para v4 (perde features de segurança).
- Usar `import * as jose from 'jose'` em código que será bundled como CJS sem garantir Node >= 22.12.
- Substituir `jose` por `jsonwebtoken` (decisão técnica do projeto, ver `.cursor/rules/01-jwt-jose.mdc`).

## Referências
- `.cursor/rules/01-jwt-jose.mdc`
- `docs/etapas/ETAPA-RAILWAY-FIX-NODE22.md`
- Node 22.12 release notes (require(esm) habilitado por padrão)
