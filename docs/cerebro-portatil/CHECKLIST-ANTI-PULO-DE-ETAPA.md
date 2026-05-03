# Checklist Anti-Pulo de Etapa (Obrigatorio)

Status: ativo  
Objetivo: impedir execucao fora da ordem sagrada e reduzir retrabalho

## Regra de uso

Este checklist deve ser preenchido antes de toda tarefa tecnica (codigo, migration, deploy ou automacao).

## Checklist

- [ ] 1. Li a fonte oficial do roadmap (`ROADMAP-CANONICO-59-MAIS.md`)?
- [ ] 2. Identifiquei a fase/etapa canonica (Cxx) da demanda?
- [ ] 3. Validei na matriz de equivalencia se existe dependência anterior aberta?
- [ ] 4. Confirmei que nao estou antecipando fase futura?
- [ ] 5. Se for excecao (bug critico), registrei evidencia objetiva do incidente?
- [ ] 6. Rodei Regra Zero Git antes de iniciar (fetch/pull/status)?
- [ ] 7. Defini prova objetiva de conclusao antes de executar?
- [ ] 8. Registrei quem executa a etapa e por que (Cursor, Perplexity Chat, Perplexity Computer, Claude Code)?
- [ ] 9. Atualizei matriz/canonico se a tarefa mudou escopo de roadmap?
- [ ] 10. Abri PR exclusivo quando a tarefa for de governanca/documentacao?

## Gate de bloqueio

Se qualquer item 1-4 estiver "NAO", a tarefa deve ser bloqueada ate regularizacao.

## Exemplo rapido de preenchimento

- Etapa alvo: C17 (1.10 RLS refinado)
- Dependencias: C04 e C08-C16
- Situacao: C04 pendente -> bloquear execucao de "concluido total", permitir somente hardening incremental documentado

