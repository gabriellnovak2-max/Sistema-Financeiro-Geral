#!/usr/bin/env bash
# Roda typecheck quando o agente termina (evento "stop").
# Nao bloqueia conclusao - apenas registra resultado.

set +e

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

if [ -f package.json ] && grep -q '"check"' package.json; then
  npm run check > /tmp/cursor-typecheck.log 2>&1
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "[hook stop] typecheck FALHOU. Veja /tmp/cursor-typecheck.log" >&2
  else
    echo "[hook stop] typecheck OK"
  fi
fi

exit 0
