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

## Como instalar (uma vez por PC)

```bash
npm install -g memoir-cli
memoir login   # cria conta com email
```

## Backup do PC atual (push)

```bash
memoir init        # configura quais ferramentas salvar
memoir push        # sobe tudo pra cloud
```

## Restaurar em PC novo (pull)

```bash
memoir login       # mesma conta
memoir pull        # baixa tudo
```

Pronto. Cursor, Claude Code, Copilot — tudo volta com as configs idênticas.

## Quando usar cada coisa

| Situação | Ferramenta |
|---|---|
| Abrindo PC novo do zero | `memoir pull` (depois de instalar Cursor) |
| Mudou User Rules em 1 PC | `memoir push` no PC que mudou, depois `memoir pull` nos outros |
| Quer sincronização automática | Camada 2 (User Rules) já faz, memoir é pra config mais ampla |

## Exemplo do dia-a-dia

É igual mudança de casa. Você não joga os móveis no caminhão de qualquer jeito — você embala caixa por caixa, etiqueta, e na casa nova tira da caixa e bota no mesmo lugar. `memoir push` é embalar tudo. `memoir pull` é desembalar do outro lado. A casa nova fica igual a antiga.

## Referências

- [memoir.sh](https://memoir.sh)
- [Blog: AI Coding Tools New Machine Setup](https://memoir.sh/blog/ai-coding-tools-new-machine-setup)
