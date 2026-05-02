---
name: escolher-melhor-executor
description: No inicio de toda tarefa em Agent mode, escolhe e informa ao Gabriel a melhor ferramenta de IA pra executar (Cursor, Codex, Claude Code, ChatGPT, Grok, Gemini ou Ask). Pede confirmacao antes de prosseguir. Nunca assume Cursor por padrao sem checar.
---

# Escolher Melhor Executor

## Quando ativar

Sempre que:
1. Gabriel mudar de Ask para Agent.
2. Gabriel abrir tarefa nova em Agent.
3. Gabriel pedir alteracao, deploy, debug ou pesquisa em Agent.

## Fluxo obrigatorio

Antes de comecar a tarefa, em uma frase curta:

1. Resumir o que entendi da tarefa.
2. Indicar a ferramenta recomendada.
3. Justificar em uma linha.
4. Pedir "ok" do Gabriel antes de executar.

## Tabela de decisao

| Tarefa | Melhor ferramenta | Motivo |
|---|---|---|
| Mexer em arquivo do repo, criar/editar codigo, commit/push | Cursor (Agent mode) | Acesso direto ao workspace + Git |
| Refatorar codigo grande, reescrever modulo inteiro | Codex (gpt-5-codex no Cursor) | Forca em codigo extenso |
| Plano de arquitetura ou auditoria longa | Claude Code | Boa em raciocinio longo + leitura ampla |
| Conversa rapida, ideia, brainstorm | ChatGPT | Resposta direta, sem repo |
| Pesquisa web atualizada (preco, prazo, doc oficial) | Perplexity Chat | Cita fontes |
| Operacao em painel externo (Vercel, Railway, Supabase web) | Perplexity Computer ou Cursor com MCP | Acesso ao painel |
| Decisao filosofica ou debate de melhor caminho | Grok | Bom em opiniao critica |
| Sumarizar email, texto longo, doc PDF | Gemini | Forte em resumo de contexto longo |
| Pergunta sobre o codigo sem alterar | Cursor (Ask mode) | Seguro, so leitura |

## Regra de bloqueio

- Nunca executar sem informar a escolha.
- Nunca usar Cursor como default sem justificar.
- Se o Gabriel pedir uma ferramenta especifica, respeitar mesmo que nao seja a otima, mas avisar o trade-off.

## Exemplo de mensagem inicial

"Visionario, essa tarefa eh X. Melhor executor: Cursor Agent (motivo: precisa mexer em server/index.ts e dar push). Posso seguir?"

## Quando errar

Se a ferramenta escolhida falhar 2 vezes na mesma tarefa, parar e propor outra ferramenta com justificativa nova.
