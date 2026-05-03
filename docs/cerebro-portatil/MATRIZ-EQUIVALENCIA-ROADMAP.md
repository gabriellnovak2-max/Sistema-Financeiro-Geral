# Matriz de Equivalencia de Roadmap (Antigo -> Novo)

Status: ativo  
Escopo: reconciliacao de governanca (sem alteracao de codigo de negocio)

## Regra de equivalencia adotada

Para manter 100% do historico sem remover nenhuma etapa:

- **L49** = base funcional sem os 6 incrementos de superpoderes.
- **L52** = L49 + 3 incrementos de arquitetura (fase 0).
- **L55** = L52 + 3 incrementos de IA/automacao (fase 5).
- **C59+** = L55 + 4 gates obrigatorios de governanca.

### Evidencia usada

- `docs/cerebro-portatil/ROADMAP-49-ETAPAS-V2-SUPERPODERES.md`
  - fase 0: `7 (4+3 novo)` (linhas de visao geral)
  - fase 5: `11 (8+3 novo)` (linhas de visao geral)
  - total consolidado: `55`
- Regra de ordem macro: `docs/cerebro/02-ordem-sagrada.md`

> Observacao: nenhuma etapa historica foi apagada. A reconciliacao somente cria trilha de equivalencia.

## Legenda de status na matriz

- **SIM**: etapa existe naquele snapshot legado
- **NAO**: etapa ainda nao existia naquele snapshot legado
- **N/A**: gate de governanca novo (nao fazia parte de snapshots antigos)
- **Status atual**: estado operacional do roadmap no momento (Concluida, Adiada, Pendente, Governanca)

## Matriz (antigo -> canonico 59+)

| Canonico | Etapa canonica | Status atual | L49 | L52 | L55 | Equivalencia antigo -> novo |
|---|---|---|---|---|---|---|
| C01 | 0.1 ADRs | Pendente | SIM | SIM | SIM | L49/52/55: 0.1 -> C01 |
| C02 | 0.2 Env refinado + validacao | Pendente | SIM | SIM | SIM | L49/52/55: 0.2 -> C02 |
| C03 | 0.3 Logger + request-id | Pendente | SIM | SIM | SIM | L49/52/55: 0.3 -> C03 |
| C04 | 0.4 Multi-tenant preparado | Pendente | SIM | SIM | SIM | L49/52/55: 0.4 -> C04 |
| C05 | 0.5 Bugbot + Autofix | Pendente | NAO | SIM | SIM | L52/55: 0.5 -> C05 |
| C06 | 0.6 MCP servers | Pendente | NAO | SIM | SIM | L52/55: 0.6 -> C06 |
| C07 | 0.7 BUGBOT.md de projeto | Pendente | NAO | SIM | SIM | L52/55: 0.7 -> C07 |
| C08 | 1.1 JWT ES256 backend | Concluida | SIM | SIM | SIM | L49/52/55: 1.1 -> C08 |
| C09 | 1.2 Bearer no frontend | Concluida | SIM | SIM | SIM | L49/52/55: 1.2 -> C09 |
| C10 | 1.3 Validacao Zod | Concluida | SIM | SIM | SIM | L49/52/55: 1.3 -> C10 |
| C11 | 1.4 Aposentar server/db.ts | Concluida | SIM | SIM | SIM | L49/52/55: 1.4 -> C11 |
| C12 | 1.5 Publishable key + JWT user | Concluida | SIM | SIM | SIM | L49/52/55: 1.5 -> C12 |
| C13 | 1.6 Persistir produtos | Adiada | SIM | SIM | SIM | L49/52/55: 1.6 -> C13 |
| C14 | 1.7 Persistir metas | Adiada | SIM | SIM | SIM | L49/52/55: 1.7 -> C14 |
| C15 | 1.8 Persistir configuracoes | Adiada | SIM | SIM | SIM | L49/52/55: 1.8 -> C15 |
| C16 | 1.9 Migration data text->date | Concluida | SIM | SIM | SIM | L49/52/55: 1.9 -> C16 |
| C17 | 1.10 RLS refinado + indices | Concluida | SIM | SIM | SIM | L49/52/55: 1.10 -> C17 |
| C18 | 2.1 Plano de contas + centro de custo | Pendente | SIM | SIM | SIM | L49/52/55: 2.1 -> C18 |
| C19 | 2.2 Categorias financeiras | Pendente | SIM | SIM | SIM | L49/52/55: 2.2 -> C19 |
| C20 | 2.3 Contas a pagar | Pendente | SIM | SIM | SIM | L49/52/55: 2.3 -> C20 |
| C21 | 2.4 Contas a receber | Pendente | SIM | SIM | SIM | L49/52/55: 2.4 -> C21 |
| C22 | 2.5 Formas de pagamento | Pendente | SIM | SIM | SIM | L49/52/55: 2.5 -> C22 |
| C23 | 2.6 Conciliacao bancaria | Pendente | SIM | SIM | SIM | L49/52/55: 2.6 -> C23 |
| C24 | 2.7 Fluxo de caixa | Pendente | SIM | SIM | SIM | L49/52/55: 2.7 -> C24 |
| C25 | 2.8 DRE | Pendente | SIM | SIM | SIM | L49/52/55: 2.8 -> C25 |
| C26 | 2.9 Emissao de boleto | Pendente | SIM | SIM | SIM | L49/52/55: 2.9 -> C26 |
| C27 | 3.1 Cadastro de produtos | Pendente | SIM | SIM | SIM | L49/52/55: 3.1 -> C27 |
| C28 | 3.2 Ficha tecnica | Pendente | SIM | SIM | SIM | L49/52/55: 3.2 -> C28 |
| C29 | 3.3 Ordem de producao | Pendente | SIM | SIM | SIM | L49/52/55: 3.3 -> C29 |
| C30 | 3.4 Controle de lote | Pendente | SIM | SIM | SIM | L49/52/55: 3.4 -> C30 |
| C31 | 3.5 Estoque multi-deposito | Pendente | SIM | SIM | SIM | L49/52/55: 3.5 -> C31 |
| C32 | 3.6 Inventario + ajuste | Pendente | SIM | SIM | SIM | L49/52/55: 3.6 -> C32 |
| C33 | 4.1 Cadastro fiscal | Pendente | SIM | SIM | SIM | L49/52/55: 4.1 -> C33 |
| C34 | 4.2 Integracao Focus NFe | Pendente | SIM | SIM | SIM | L49/52/55: 4.2 -> C34 |
| C35 | 4.3 Emissao NFe de saida | Pendente | SIM | SIM | SIM | L49/52/55: 4.3 -> C35 |
| C36 | 4.4 Reforma tributaria | Pendente | SIM | SIM | SIM | L49/52/55: 4.4 -> C36 |
| C37 | 5.1 n8n self-hosted | Pendente | SIM | SIM | SIM | L49/52/55: 5.1 -> C37 |
| C38 | 5.2 n8n com Supabase | Pendente | SIM | SIM | SIM | L49/52/55: 5.2 -> C38 |
| C39 | 5.3 OCR de NF entrada | Pendente | SIM | SIM | SIM | L49/52/55: 5.3 -> C39 |
| C40 | 5.4 Classificacao automatica | Pendente | SIM | SIM | SIM | L49/52/55: 5.4 -> C40 |
| C41 | 5.5 Alertas inteligentes | Pendente | SIM | SIM | SIM | L49/52/55: 5.5 -> C41 |
| C42 | 5.6 Bot WhatsApp vendas (audio) | Pendente | SIM | SIM | SIM | L49/52/55: 5.6 -> C42 (etapa evoluida) |
| C43 | 5.7 Cobranca automatica PIX/Boleto | Pendente | NAO | NAO | SIM | L55: 5.7 -> C43 |
| C44 | 5.8 Automacao fiscal | Pendente | SIM | SIM | SIM | L49/52/55: 5.8 -> C44 |
| C45 | 5.9 Automacao de estoque | Pendente | SIM | SIM | SIM | L49/52/55: 5.9 -> C45 |
| C46 | 5.10 Cursor Cloud Agents | Pendente | NAO | NAO | SIM | L55: 5.10 -> C46 |
| C47 | 5.11 Cursor Automations | Pendente | NAO | NAO | SIM | L55: 5.11 -> C47 |
| C48 | 6.1 Dashboard executivo | Pendente | SIM | SIM | SIM | L49/52/55: 6.1 -> C48 |
| C49 | 6.2 Margem por cliente/produto/lote | Pendente | SIM | SIM | SIM | L49/52/55: 6.2 -> C49 |
| C50 | 6.3 Estoque parado + giro | Pendente | SIM | SIM | SIM | L49/52/55: 6.3 -> C50 |
| C51 | 6.4 Exportacao Excel/PDF | Pendente | SIM | SIM | SIM | L49/52/55: 6.4 -> C51 |
| C52 | 7.1 Papeis e permissoes | Pendente | SIM | SIM | SIM | L49/52/55: 7.1 -> C52 |
| C53 | 7.2 PWA | Pendente | SIM | SIM | SIM | L49/52/55: 7.2 -> C53 |
| C54 | 7.3 Telas mobile | Pendente | SIM | SIM | SIM | L49/52/55: 7.3 -> C54 |
| C55 | 7.4 Biometria + 2FA | Pendente | SIM | SIM | SIM | L49/52/55: 7.4 -> C55 |
| C56 | G56 Validar fase/dependencias antes de codar | Governanca | N/A | N/A | N/A | C59+: gate novo |
| C57 | G57 Regra Zero Git obrigatoria | Governanca | N/A | N/A | N/A | C59+: gate novo |
| C58 | G58 Prova objetiva obrigatoria | Governanca | N/A | N/A | N/A | C59+: gate novo |
| C59 | G59 Atualizar matriz em toda mudanca de roadmap | Governanca | N/A | N/A | N/A | C59+: gate novo |

## Consolidacao final

- Todas as etapas do legado 49/52/55 foram preservadas.
- Todas as etapas antigas possuem equivalencia rastreavel no canonico.
- Nenhum item foi removido; apenas consolidado com regra de governanca.
