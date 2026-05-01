# Camada 4 — memoir-cli

## O que é

CLI que faz backup e restore de **todas as configs de IA** que você tem em ferramentas como Cursor, Claude Code, GitHub Copilot, Continue, Aider etc. Faz `push` pra cloud do memoir, `pull` em outro PC e tudo volta igualzinho.

## O que ele guarda

11 ferramentas de IA, incluindo:
- Cursor (rules, mcp.json, settings)
- Claude Code
- GitHub Copilot
- Continue
- Aider
- Cline
- Roo Code

## Verificação de existência (01/05/2026)

✅ Pacote `memoir-cli` confirmado no [npm registry](https://www.npmjs.com/package/memoir-cli) e [debricked](https://debricked.com/select/package/pkg:npm%2Fmemoir-cli). Site oficial: [memoir.sh](https://memoir.sh).

## Como instalar (uma vez por PC)

**Opção A — instala global (recomendado):**
```bash
npm install -g memoir-cli
```

**Opção B — roda direto sem instalar (jeito do site oficial):**
```bash
npx memoir-cli
```

## Setup inicial

```bash
memoir init        # configura: escolhe GitHub Repo como storage, ativa criptografia
```

Vai pedir:
- Provedor de storage (escolher **GitHub Repo**)
- Ativar criptografia? **Sim** (AES-256-GCM)
- Senha (passphrase) — **GUARDAR EM GERENCIADOR DE SENHA. Se perder, perde tudo.**

## Backup do PC atual (push)

```bash
memoir push        # sobe tudo encriptado pro GitHub privado
```

O `push` rastreia automaticamente:
- Configs do Cursor, Claude Code, Copilot etc
- 11 ferramentas de IA suportadas
- Bloqueia se detectar API key/token expostos

## Restaurar em PC novo (pull)

```bash
npx memoir-cli     # ou: npm install -g memoir-cli
memoir restore     # baixa e descriptografa com a senha
```

⚠️ O comando é `memoir restore` (não `memoir pull` — corrigido conforme docs oficiais).

Pronto. Cursor, Claude Code, Copilot — tudo volta com as configs idênticas.

## Quando usar cada coisa

| Situação | Ferramenta |
|---|---|
| Abrindo PC novo do zero | `memoir restore` (depois de instalar Cursor) |
| Mudou User Rules em 1 PC | `memoir push` no PC que mudou, depois `memoir restore` nos outros |
| Quer sincronização automática | Camada 2 (User Rules) já faz, memoir é pra config mais ampla |

## Exemplo do dia-a-dia

É igual mudança de casa. Você não joga os móveis no caminhão de qualquer jeito — você embala caixa por caixa, etiqueta, e na casa nova tira da caixa e bota no mesmo lugar. `memoir push` é embalar tudo. `memoir restore` é desembalar do outro lado. A casa nova fica igual a antiga.

## Referências

- [memoir.sh](https://memoir.sh)
- [Blog: AI Coding Tools New Machine Setup](https://memoir.sh/blog/ai-coding-tools-new-machine-setup)
