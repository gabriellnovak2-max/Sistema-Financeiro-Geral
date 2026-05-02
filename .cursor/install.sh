#!/usr/bin/env bash
# Setup do Background Agent (VM Ubuntu Cursor).
# Garante Node 22.12 (mesmo runtime do Railway) antes de instalar deps.

set -e

echo "[install] Configurando Node 22 via NVM..."
if ! command -v nvm >/dev/null 2>&1; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

# shellcheck disable=SC1091
. "$HOME/.nvm/nvm.sh"
nvm install 22.12.0
nvm use 22.12.0

echo "[install] Node version:"
node -v
echo "[install] NPM version:"
npm -v

echo "[install] Instalando dependencias..."
npm ci

echo "[install] Smoke test do jose (ESM):"
node -e "import('jose').then(j => console.log('jose OK:', Object.keys(j).length, 'exports'))"

echo "[install] OK."
