#!/usr/bin/env bash
# Bloqueia edicao de arquivos sensiveis depois que o agente tenta salvar.
# Recebe { file_path } via stdin.
# Retorna { permission: "allow" | "deny", userMessage }

set -e

read -r payload || true
file=$(printf '%s' "$payload" | jq -r '.file_path // empty' 2>/dev/null || echo "")

deny() {
  msg="$1"
  jq -n --arg m "$msg" '{permission:"deny", userMessage:$m}'
  exit 0
}

# Sempre permitir .env.example (template publico)
case "$file" in
  *.env.example|*.env.template|*.env.sample)
    jq -n '{permission:"allow"}'
    exit 0
    ;;
esac

# Bloquear arquivos sensiveis
case "$file" in
  *.env|*.env.*|*.envrc)
    deny "Bloqueado: edicao de arquivo .env. Use .env.example como template e variaveis no painel Railway/Vercel."
    ;;
  *.pem|*.key|*.pfx|*.p12)
    deny "Bloqueado: edicao de arquivo de chave/certificado."
    ;;
  *credentials*|*secrets*|*.aws/*|*.gcp/*)
    deny "Bloqueado: edicao de arquivo de credenciais."
    ;;
esac

# Allow padrao
jq -n '{permission:"allow"}'
