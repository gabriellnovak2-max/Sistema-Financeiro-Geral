# ROADMAP CANONICO UNICO (59+)

Status: fonte oficial ativa  
Escopo: governanca e rastreabilidade de etapas (sem codigo de negocio)

## Fonte oficial (regra explicita)

Este arquivo e a **fonte oficial unica** para decisao de fase e sequencia de execucao.

- Arquivo oficial: `docs/cerebro-portatil/ROADMAP-CANONICO-59-MAIS.md`
- Matriz oficial de equivalencia: `docs/cerebro-portatil/MATRIZ-EQUIVALENCIA-ROADMAP.md`
- Checklist oficial anti-pulo: `docs/cerebro-portatil/CHECKLIST-ANTI-PULO-DE-ETAPA.md`

## Legado preservado (nao remover)

Os arquivos abaixo continuam no repo como historico tecnico e detalhamento:

- `docs/cerebro-portatil/ROADMAP-49-ETAPAS-V2-SUPERPODERES.md` (detalhamento funcional das etapas)
- `docs/cerebro/02-ordem-sagrada.md` (ordem macro das fases)
- `docs/cerebro-fiscal.md` (roadmap fiscal especializado)

## Ordem sagrada canonica

1. Fase 0 - Arquitetura
2. Fase 1 - Blindagem
3. Fase 2 - Financeiro
4. Fase 3 - Estoque/Producao
5. Fase 4 - Fiscal
6. Fase 5 - IA + n8n + WhatsApp
7. Fase 6 - BI
8. Fase 7 - Mobile + Roles

Regra de bloqueio: nenhuma tarefa de fase futura entra antes da fase anterior estar fechada, exceto bug critico de producao com registro de evidencia.

## Estrutura canonica 59+

- Base funcional consolidada: **55 etapas** (compativel com legado 49/52/55)
- Gates de governanca obrigatorios: **4 etapas**
- Total canonico atual: **59 etapas**
- Sufixo "+": reservado para expansoes futuras sem quebrar equivalencia historica

### Gates de governanca (59 base)

- G56 - Validacao de fase/dependencias antes de codar
- G57 - Regra Zero Git (pull antes, push depois, hash registrado)
- G58 - Prova objetiva de conclusao (check/build/teste/log)
- G59 - Atualizacao da matriz de equivalencia quando houver mudanca de roadmap

## Como usar no dia a dia

1. Confirmar fase no roadmap canonico.
2. Validar equivalencia na matriz (49/52/55 -> 59+).
3. Rodar checklist anti-pulo antes de qualquer implementacao.
4. So depois abrir branch e executar.

## Estado atual da reconciliacao

- Reconciliacao concluida para versoes 49, 52 e 55.
- Nenhuma etapa antiga foi removida.
- Toda etapa antiga foi mapeada para a estrutura canonica 59+.
