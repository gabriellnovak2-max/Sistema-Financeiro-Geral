#!/usr/bin/env bash
# Bloqueia comandos destrutivos antes de o shell executar.
# Recebe payload JSON via stdin com campo .command
# Retorna JSON com { permission: "allow" | "deny", userMessage }

set -e

read -r payload || true
cmd=$(printf '%s' "$payload" | jq -r '.command // empty' 2>/dev/null || echo "")

deny() {
  msg="$1"
  jq -n --arg m "$msg" '{permission:"deny", userMessage:$m}'
  exit 0
}

# rm -rf em raiz/sistema
if printf '%s' "$cmd" | grep -Eq 'rm[[:space:]]+(-[a-zA-Z]*[rRf][a-zA-Z]*)[[:space:]]+(/|~|\$HOME|C:\\\\|/Users)'; then
  deny "Bloqueado: rm -rf em raiz/sistema. Acao destrutiva. Reformule pedindo path especifico do projeto."
fi

# git push --force / --force-with-lease em qualquer branch
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push.*--force(-with-lease)?'; then
  deny "Bloqueado: git push --force. Pode apagar trabalho de outros agentes/contributors. Pedir confirmacao explicita do Gabriel."
fi

# git push direto em main
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push[[:space:]]+(origin[[:space:]]+)?main([[:space:]]|$)'; then
  if ! printf '%s' "$cmd" | grep -Eq 'HEAD:main|main:main'; then
    : # noop, push origin main eh comum, deixa passar
  fi
fi

# git reset --hard
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+reset[[:space:]]+--hard'; then
  deny "Bloqueado: git reset --hard. Pode perder trabalho local nao commitado. Pedir confirmacao."
fi

# Railway destrutivo
if printf '%s' "$cmd" | grep -Eq 'railway[[:space:]]+(delete|destroy|down|volume[[:space:]]+delete|service[[:space:]]+delete|project[[:space:]]+delete)'; then
  deny "Bloqueado: comando destrutivo Railway. Caso PocketOS (abr/2026) - apagou prod em 9s. Pedir aprovacao explicita."
fi

# Supabase reset
if printf '%s' "$cmd" | grep -Eq 'supabase[[:space:]]+db[[:space:]]+reset'; then
  deny "Bloqueado: supabase db reset. Apaga dados. Em prod e fatal."
fi

# DROP TABLE / TRUNCATE em SQL
if printf '%s' "$cmd" | grep -Eqi '(drop[[:space:]]+table|truncate[[:space:]]+table)[[:space:]]+(public\\.)?(clientes|vendas|contas_pagar|contas_receber|lancamentos)'; then
  deny "Bloqueado: DROP/TRUNCATE em tabela de producao. Pedir aprovacao explicita."
fi

# npm install -g em pacotes problematicos no Windows
if printf '%s' "$cmd" | grep -Eq 'npm[[:space:]]+install[[:space:]]+-g[[:space:]]+(supabase)'; then
  deny "Bloqueado: npm install -g supabase nao funciona no Windows. Use Scoop: scoop install supabase."
fi

# Allow padrao
jq -n '{permission:"allow"}'
