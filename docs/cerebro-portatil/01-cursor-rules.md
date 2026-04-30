# Camada 1 — `.cursor/rules/` + Git

## O que é

Pasta `.cursor/rules/` dentro do repo. Contém arquivos `.mdc` (Markdown com frontmatter) que o Cursor lê automaticamente quando abre o projeto.

## Por que é portátil

Está no Git. Quando o Gabriel der `git clone` em qualquer PC, o Cursor já encontra as regras. **Sincroniza junto com o código.**

## Arquivos atuais

| Arquivo | O que faz |
|---|---|
| `gabriel-humanizado.mdc` | Persona Visionário/Gabriel, PT-BR mineiro, exemplo dia-a-dia |
| `cerebro-operacional.mdc` | Ordem Sagrada, stack fixa, regras Git |
| `setup-novo-pc.mdc` | Roteiro pra Cursor quando abre em PC novo |
| `roadmap-oficial.mdc` | Referência ao roadmap de 55 etapas |

## Como adicionar regra nova

1. Cria arquivo em `.cursor/rules/<nome>.mdc`
2. Frontmatter:
```yaml
---
description: Descrição curta
globs:
alwaysApply: true
---
```
3. Conteúdo em Markdown
4. Commit + push

## Referências

- [Documentação oficial Cursor Rules](https://docs.cursor.com/context/rules)
- Versão `.cursorrules` (legacy) ainda existe na raiz do repo, mas o padrão novo é `.cursor/rules/`.

## Exemplo do dia-a-dia

É igual o caderno de receitas de bolo da padaria. Tá pendurado no balcão, todo padeiro novo que chegar lê antes de fazer o bolo. Se o dono mudar a receita, todo mundo lê a versão nova porque o caderno é o mesmo.
