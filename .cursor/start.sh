#!/usr/bin/env bash
# Boot do Background Agent.
# Carrega Node 22 e disponibiliza ambiente para o agente.

set -e

# shellcheck disable=SC1091
. "$HOME/.nvm/nvm.sh"
nvm use 22.12.0

echo "[start] Background Agent pronto."
echo "[start] Node: $(node -v)"
echo "[start] CWD: $(pwd)"
echo "[start] Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'sem git')"
