# CÉREBRO FISCAL — Sistema Financeiro Geral — Patrocínio Café

> **Arquivo:** `cerebro-fiscal.md` · **Versão:** 1.0.0 · **Data base:** Junho 2026
> **Projeto:** ERP Sistema-Financeiro-Geral — Patrocínio Café (Goiânia-GO)
> **Dono:** Gabriel (Judson Gabriell Martins)
> **Stack:** React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase

---

## 🎯 MANIFESTO — COMO USAR ESTE ARQUIVO

### Para o Cursor (leia isto antes de qualquer tarefa fiscal)

Este arquivo é o **único ponto de verdade** para decisões fiscais no ERP da Patrocínio Café. Antes de qualquer alteração que envolva nota fiscal, tributo, banco, compliance ou integração:

1. **Leia a seção relevante deste arquivo.** Não invente. Não suponha. Não "acha que lembra".
2. **Consulte o Roadmap (Seção 3) pra saber se a funcionalidade já deveria existir.** Não antecipe fases. Não implemente NFC-e na Fase 1. Não implemente CT-e antes da Fase 3.
3. **Antes de qualquer migration SQL destrutiva (DROP, ALTER, DELETE de dados):** pare e confirme com Gabriel. Em PT-BR informal. Com exemplos do que vai mudar e o que pode dar errado.
4. **Antes de afirmar qualquer fato externo** (alíquota, prazo, regra SEFAZ, preço de API): pesquise. Este arquivo cita fontes; use-as. Se a data do arquivo for velha, busque atualização.
5. **Commite sempre.** `git pull` antes de começar qualquer sessão. `git push` ao terminar. Mensagem de commit descritiva em PT-BR.

### Regras inegociáveis

- Nunca concordar com Gabriel quando ele estiver tecnicamente errado — explique o motivo com clareza, sem ser grosseiro.
- Nunca "fingir" que algo funciona. Se a funcionalidade ainda não existe, diga que não existe.
- Nunca deletar ou alterar dados de produção sem backup confirmado.
- Nunca usar `console.log` em código que vai pra produção sem log estruturado (`supabase.functions.invoke` + `console.error` para erros).
- Nunca usar variáveis de ambiente sem checar se existem no `.env` e no Supabase Secrets.
- Código TypeScript sempre com tipos explícitos. Nunca `any` em interfaces de dados fiscais.
- SQL sempre testado no Supabase Dashboard antes de rodar em produção.

### O que este arquivo NÃO é

- Não é documentação de UX ou frontend. Para UI, consulte o `design-system.md` (quando existir).
- Não é a fonte de verdade para fluxos de Ordem de Produção (Fase 2) — esse arquivo virá depois.
- Não substitui um contador humano para decisões de planejamento tributário.

---

## 📋 METADADOS DO PROJETO

| Campo | Valor |
|-------|-------|
| **Projeto** | ERP Sistema-Financeiro-Geral — Patrocínio Café |
| **Fase atual** | Fase 1 — Financeiro Geral |
| **Empresa** | Patrocínio Café (torrefação private label) |
| **Responsável** | Gabriel (Judson Gabriell Martins) |
| **Localização** | Goiânia-GO |
| **Volume** | ~25.000 kg/mês de café torrado |
| **CNAE** | 1081-3/02 (Torrefação e Moagem de Café) |
| **Stack** | React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase |
| **Backend** | Supabase (PostgreSQL + Edge Functions + Auth + Storage) |
| **Emissão fiscal** | [Focus NFe API v2](https://focusnfe.com.br/doc/) |
| **Linguagem de API** | TypeScript (Deno nas Edge Functions) |
| **Versão Node** | Deno 1.x (Edge Functions Supabase) |
| **Idioma do sistema** | Português Brasileiro |
| **Arquivo de regras Cursor** | `.cursorrules` (aponta pra este arquivo) |

### Caminhos importantes no repositório

```
/
├── .cursorrules                    # Aponta pro cerebro-fiscal.md
├── cerebro-fiscal.md               # ESTE ARQUIVO
├── supabase/
│   ├── migrations/                 # Migrations SQL fiscais
│   │   ├── 0001_fiscal_base.sql
│   │   ├── 0002_fiscal_rls.sql
│   │   └── 0003_fiscal_indexes.sql
│   └── functions/
│       ├── nfe-emitir/
│       │   └── index.ts
│       ├── nfe-consultar/
│       │   └── index.ts
│       ├── nfe-cancelar/
│       │   └── index.ts
│       ├── nfe-carta-correcao/
│       │   └── index.ts
│       ├── nfce-emitir/
│       │   └── index.ts
│       ├── nfse-emitir/
│       │   └── index.ts
│       ├── focus-webhook/
│       │   └── index.ts
│       ├── xml-download/
│       │   └── index.ts
│       ├── ocr-nfe/
│       │   └── index.ts
│       ├── conciliacao-bancaria/
│       │   └── index.ts
│       ├── chatbot-fiscal/
│       │   └── index.ts
│       └── _shared/
│           ├── focus-client.ts
│           ├── validators.ts
│           └── xml-parser.ts
├── src/
│   ├── components/
│   │   └── fiscal/                 # Componentes React de NF-e, NFC-e
│   ├── pages/
│   │   └── fiscal/
│   └── lib/
│       └── supabase.ts
└── .env.local                      # Variáveis locais (nunca commitar)
```

---

## 🗺️ ROADMAP DE IMPLEMENTAÇÃO FISCAL (Ordem de Introdução)

Esta lista define **quando** cada funcionalidade fiscal entra. O Cursor deve consultar este roadmap antes de qualquer implementação.

> **Regra de ouro:** Nunca pular fases. Se Gabriel pedir NFC-e antes de ter o Financeiro funcionando, explique o motivo e proponha o plano correto.

### FASE 1 — Financeiro Geral (FASE ATUAL)

Pré-requisitos para qualquer emissão fiscal. O sistema financeiro tem que respirar antes de emitir nota.

| # | Funcionalidade | Gatilho para introduzir | Status |
|---|---------------|------------------------|--------|
| 1 | **Cadastro de empresas emitentes** | Dia 1 | Pendente |
| 2 | **Upload e gestão de certificado A1** | Cadastro empresa OK | Pendente |
| 3 | **Plano de contas básico** | Dia 1 | Pendente |
| 4 | **Contas a Pagar (lançamentos manuais)** | Plano de contas OK | Pendente |
| 5 | **Contas a Receber (lançamentos manuais)** | Plano de contas OK | Pendente |
| 6 | **Fluxo de Caixa (DFC)** | CP + CR funcionando | Pendente |
| 7 | **DRE básica** | Fluxo de Caixa OK | Pendente |
| 8 | **Conciliação bancária manual** | CP + CR funcionando | Pendente |
| 9 | **Catálogo de produtos com NCM/CFOP/CST** | Plano de contas OK | Pendente |
| 10 | **Cadastro de clientes/fornecedores com CNPJ validation** | Dia 1 | Pendente |
| 11 | **Emissão NF-e modelo 55 (atacado)** | Items 1–10 prontos | Pendente |
| 12 | **Consulta e cancelamento de NF-e** | NF-e emissão OK | Pendente |
| 13 | **Carta de Correção eletrônica (CC-e)** | NF-e emissão OK | Pendente |
| 14 | **Webhook Focus NFe → atualização automática de status** | NF-e emissão OK | Pendente |
| 15 | **Download automático de XML** | Webhook OK | Pendente |
| 16 | **OCR de nota de fornecedor (NF-e recebida)** | Download XML OK | Pendente |
| 17 | **Manifestação automática do destinatário** | OCR OK | Pendente |
| 18 | **Conciliação bancária com IA (4 camadas)** | Conciliação manual OK | Pendente |
| 19 | **Alertas de certificado vencendo** | Certificado A1 OK | Pendente |
| 20 | **Chatbot fiscal interno** | NF-e OK + DRE OK | Pendente |

### FASE 2 — Ordem de Produção (Futura)

Só entra depois que toda a Fase 1 estiver estável e em produção há pelo menos 30 dias.

| # | Funcionalidade | Gatilho |
|---|---------------|---------|
| 21 | **Ordem de Produção (OP) — criação e acompanhamento** | Fase 1 completa e estável |
| 22 | **Emissão NFC-e modelo 65 (balcão)** | OP funcionando + PDV físico |
| 23 | **Impressão de DANFE NFC-e + QR Code** | NFC-e emissão OK |
| 24 | **Contingência offline NFC-e (EPEC)** | NFC-e produção OK |
| 25 | **Rastreabilidade lote de produção** | OP OK |
| 26 | **Custo de produção por lote** | OP OK |

### FASE 3 — Compras Café Cru + Maquinação AGB + n8n (Futura)

| # | Funcionalidade | Gatilho |
|---|---------------|---------|
| 27 | **Gestão de compras de café cru** | Fase 2 completa |
| 28 | **CT-e (transporte café MG→GO)** | Compras OK |
| 29 | **MDF-e (manifesto de veículo)** | CT-e OK |
| 30 | **Manifestação do destinatário automatizada (NF-e recebida)** | CT-e OK |
| 31 | **NFS-e Goiânia (torra terceirizada)** | Maquinação AGB ativa |
| 32 | **Integração n8n (automações entre sistemas)** | Fases 1+2+3 OK |
| 33 | **Previsão de fluxo de caixa com IA** | 6 meses de histórico |
| 34 | **Agente autônomo de fechamento mensal** | 3 meses de histórico |
| 35 | **Relatório automático para contador** | Agente fechamento OK |

---

## PARTE I — FUNDAMENTOS FISCAIS

### 1. Glossário Essencial

Toda vez que o Cursor precisar usar um desses termos em código ou comentário, consulte a definição aqui.

#### Documentos Fiscais

| Sigla | Nome completo | Uso |
|-------|--------------|-----|
| **NF-e** | Nota Fiscal Eletrônica | Modelo 55. Vendas B2B (empresa para empresa), remessas, industrialização. XML assinado digitalmente transmitido à SEFAZ. |
| **NFC-e** | Nota Fiscal de Consumidor Eletrônica | Modelo 65. Venda no balcão para consumidor final (pessoa física). Síncrona, QR Code obrigatório. |
| **NFS-e** | Nota Fiscal de Serviço Eletrônica | Nota municipal. Emitida por prestadores de serviço. Para a Patrocínio: torra terceirizada. Emitida à Prefeitura de Goiânia. |
| **CT-e** | Conhecimento de Transporte Eletrônico | Modelo 57. Emitido pela transportadora. Documenta o transporte de mercadorias entre estados. |
| **MDF-e** | Manifesto de Documentos Fiscais Eletrônicos | Documento que "registra" o veículo em trânsito, listando todos os CT-es e NF-es que carrega. |
| **DANFE** | Documento Auxiliar da Nota Fiscal Eletrônica | Representação impressa em papel da NF-e. Acompanha a mercadoria. Não tem valor fiscal sem o XML autorizado. |
| **CC-e** | Carta de Correção Eletrônica | Evento eletrônico para corrigir dados da NF-e que não envolvam valor, CNPJ ou itens. |
| **EPEC** | Evento Prévio de Emissão em Contingência | Modalidade de contingência para NFC-e/NF-e quando a SEFAZ está offline. |
| **SVC** | SEFAZ Virtual de Contingência | Servidor backup nacional que autoriza NF-e quando a SEFAZ estadual está fora do ar. |

#### Órgãos e Sistemas

| Sigla | O que é |
|-------|---------|
| **SEFAZ** | Secretaria da Fazenda (estadual). Autoriza NF-e, NFC-e, CT-e, MDF-e. Em Goiás: Secretaria da Economia (economia.go.gov.br). |
| **SEFAZ-GO** | Secretaria da Economia do Estado de Goiás. |
| **RFB** | Receita Federal do Brasil. Autoriza CBS (a partir de 2027), EFD Contribuições, ECF. |
| **SPED** | Sistema Público de Escrituração Digital. Conjunto de obrigações eletrônicas: EFD ICMS/IPI, EFD Contribuições, ECD, ECF. |
| **GNRE** | Guia Nacional de Recolhimento de Tributos Estaduais. Usada para pagar ICMS-ST em operações interestaduais. |
| **SGISS** | Sistema de Gestão, Fiscalização e Arrecadação do ISS. Plataforma da Prefeitura de Goiânia para NFS-e. |

#### Impostos e Códigos

| Sigla | Nome | Descrição resumida |
|-------|------|-------------------|
| **ICMS** | Imposto sobre Circulação de Mercadorias e Serviços | Imposto estadual. Incide nas saídas de mercadorias. Em GO, café torrado = 12% intraestadual. |
| **IPI** | Imposto sobre Produtos Industrializados | Federal. Para café torrado (0901.21.00), alíquota = 0% na TIPI. |
| **PIS** | Programa de Integração Social | Federal. 0,65% (Lucro Presumido/cumulativo) ou 1,65% (Lucro Real/não cumulativo). |
| **COFINS** | Contribuição para Financiamento da Seguridade Social | Federal. 3% (cumulativo) ou 7,6% (não cumulativo). |
| **ISS** | Imposto sobre Serviços | Municipal. Incide em serviços. Para torra terceirizada: 5% (subitem 14.05), mas ver seção 4.3. |
| **CBS** | Contribuição sobre Bens e Serviços | Federal. Substitui PIS + COFINS a partir de 2027. Alíquota de referência: 8,8%. Café = alíquota zero. |
| **IBS** | Imposto sobre Bens e Serviços | Estadual/Municipal. Substitui ICMS + ISS a partir de 2033. Alíquota de referência: 17,7%. Café = alíquota zero. |
| **IS** | Imposto Seletivo | Federal. Incide em produtos nocivos (cigarro, bebida alcoólica, refrigerante). Café não está sujeito. |
| **DIFAL** | Diferencial de Alíquotas | ICMS cobrado quando há diferença entre alíquota interna do estado destino e a alíquota interestadual. |
| **ICMS-ST** | ICMS por Substituição Tributária | O fabricante/importador recolhe o ICMS de toda a cadeia. Café torrado em grão (0901.21.00) não tem ST em GO. |
| **NCM** | Nomenclatura Comum do Mercosul | Código de 8 dígitos que classifica o produto. Café torrado em grão = **0901.21.00**. Obrigatório na NF-e. |
| **CFOP** | Código Fiscal de Operações e Prestações | 4 dígitos. Define a natureza da operação. Ex: 5101 = venda de produção própria intraestadual. |
| **CST** | Código de Situação Tributária | Define a situação do ICMS, IPI, PIS, COFINS no item da nota. |
| **CSOSN** | Código de Situação da Operação no Simples Nacional | Substitui o CST para optantes do Simples Nacional. |
| **CEST** | Código Especificador da Substituição Tributária | 7 dígitos. Só obrigatório quando há substituição tributária. |

---

### 2. Regime Tributário da Patrocínio Café

#### Faturamento estimado

- Volume: ~25.000 kg/mês
- Preço médio saída (estimativa conservadora): R$ 30/kg
- **Receita Bruta Anual estimada: R$ 9.000.000/ano**

#### Por que o Simples Nacional está descartado

O Simples Nacional tem **teto de R$ 4,8 milhões/ano** ([LC 123/2006](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm)). A Patrocínio Café provavelmente já ultrapassou — ou vai ultrapassar em breve — esse limite. Qualquer planejamento de ERP deve assumir que a empresa está **fora do Simples Nacional**.

#### Lucro Presumido vs. Lucro Real

| Critério | Lucro Presumido | Lucro Real |
|----------|----------------|------------|
| **PIS/COFINS** | Cumulativo: 0,65% + 3% = 3,65% da receita | Não cumulativo: 1,65% + 7,6% = 9,25% — mas com créditos sobre insumos |
| **IRPJ/CSLL** | Sobre presunção de 8% (indústria): ~1,68% + 1,08% = 2,76% da receita | Sobre o lucro efetivo |
| **Complexidade** | Baixa — apuração simplificada | Alta — exige contabilidade robusta |
| **Teto** | R$ 78 milhões/ano | Sem teto |
| **Créditos PIS/COFINS** | Não permite | Permite sobre insumos, energia, embalagens |
| **Indicação** | Margem alta, poucos créditos de insumos | Custos altos de insumos/embalagens/energia |

**Recomendação do arquivo:** Simular com contador os dois regimes usando dados reais de custo de café cru, embalagens e energia elétrica. Para torrefação com volume alto de compra de café cru (principal insumo), os créditos de PIS/COFINS no Lucro Real podem compensar. Mas como o café cru comprado de produtor rural tem imunidade/isenção, os créditos principais vêm de embalagens, energia e fretes.

> Este arquivo não substitui a simulação com o contador. A recomendação acima é orientação técnica, não decisão definitiva.

#### CNAE principal

**1081-3/02 — Torrefação e Moagem de Café** ([DP Objetivo](https://dpobjetivo.com.br/tabelas/atribuicoes-do-cnae.html?cnae=1081302-torrefacao-e-moagem-de-cafe))

Características importantes para o ERP:
- Empresa industrial (Anexo II do Simples — irrelevante se estiver fora)
- RAT (Risco Ambiental do Trabalho): **3,00%** (risco grave)
- Requer Livro de Registro de Entradas e Saídas (SPED Fiscal)
- Requer EFD ICMS/IPI (contribuinte de ICMS em Goiás)

---

### 3. Impostos que Incidem sobre Torrefação de Café

#### Tabela de impostos por tipo de operação

| Operação | ICMS | IPI | PIS | COFINS | ISS | Observação |
|----------|------|-----|-----|--------|-----|------------|
| Venda café torrado (GO → GO) | 12% | 0% | 0,65% ou 1,65% | 3% ou 7,6% | Não | CFOP 5101 ou 5102 |
| Venda café torrado (GO → outros estados) | 12% (saída GO) | 0% | idem | idem | Não | CFOP 6101 ou 6102 |
| Compra café cru (produtor rural GO) | Diferimento | 0% | Crédito presumido | Crédito presumido | Não | CFOP 1101 |
| Compra café cru (MG → GO) | 12% (alíq. interestadual) | 0% | idem | idem | Não | CFOP 2101 |
| Torra terceirizada (serviço) | ICMS sobre valor agregado | 0% | idem | idem | Ver nota | Ver seção 4.3 |
| Venda ao consumidor final (balcão) | 12% | 0% | idem | idem | Não | CFOP 5102, NFC-e |

**Nota sobre ISS na torra terceirizada:** O STF decidiu que industrialização por encomenda (onde o produto retorna ao encomendante para comercialização) **não está sujeita ao ISS** — incide ICMS sobre o valor agregado. ([Decisão STF — Industrialização por Encomenda](https://original123.com.br/25048-2/)) Confirmado pelo [Parecer Normativo SEFAZ-GO nº 014/2018](https://appasp.economia.go.gov.br/legislacao/arquivos/Superintendencia/SGAF/Parecer_Normativo/P_0014_2018.htm).

#### NCM do café (Patrocínio Café usa principalmente)

| NCM | Produto | Alíquota IPI |
|-----|---------|-------------|
| **0901.21.00** | Café torrado em grão, não descafeinado | **0%** |
| **0901.22.00** | Café torrado e moído, não descafeinado | **0%** |
| 0901.11.10 | Café cru em grão (entrada) | 0% |
| 2101.11.10 | Extratos e concentrados de café | 0% |

Fonte: TIPI atualizada ([Decreto nº 11.158/2022](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/Decreto/D11158.htm) + atualizações 2025).

#### CFOP principais para a Patrocínio Café

**Entradas:**

| CFOP | Descrição | Quando usar |
|------|-----------|-------------|
| **1.101** | Compra para industrialização — intraestadual | Café cru de fornecedor em Goiás |
| **2.101** | Compra para industrialização — interestadual | Café cru de MG, SP, ES, MG |
| **1.901** | Entrada para industrialização por encomenda — intraestadual | Recebe café cru pra torrar por conta do cliente (em GO) |
| **2.901** | Entrada para industrialização por encomenda — interestadual | Recebe café cru de outro estado pra torrar |
| **1.124** | Industrialização para outra empresa — retorno intraestadual | Retorno do café torrado do industrializador |

**Saídas:**

| CFOP | Descrição | Quando usar |
|------|-----------|-------------|
| **5.101** | Venda de produção do estabelecimento — intraestadual | Venda de café torrado para cliente em GO |
| **6.101** | Venda de produção do estabelecimento — interestadual | Venda de café torrado para cliente em outro estado |
| **5.102** | Venda de mercadoria adquirida de terceiros — intraestadual | Venda de café que foi comprado pronto |
| **6.102** | Venda de mercadoria adquirida de terceiros — interestadual | Idem para outro estado |
| **5.124** | Industrialização para outra empresa — saída intraestadual | Devolução do café torrado ao encomendante em GO |
| **6.124** | Industrialização para outra empresa — saída interestadual | Idem para outro estado |

Fonte: [Focus NFe — CFOP de Entrada](https://focusnfe.com.br/blog/cfop-de-entrada/) + [Tabela CFOP Completa](https://idealsoftwares.com.br/notas/tabela_cfop.pdf)

---

### 4. Obrigações Acessórias Mensais e Anuais

Esta tabela é o **calendário fiscal do ERP**. O módulo de alertas deve disparar com antecedência mínima de 5 dias úteis antes de cada prazo.

#### Obrigações mensais (Lucro Presumido ou Real)

| Obrigação | O que é | Prazo | Órgão | Penalidade por atraso |
|-----------|---------|-------|-------|-----------------------|
| **EFD ICMS/IPI** (SPED Fiscal) | Escrituração de entradas/saídas, apuração ICMS | Dia **20** do mês seguinte (GO) | SEFAZ-GO | 0,02% ao dia sobre RB, máx 1% |
| **EFD Contribuições** | PIS/COFINS apurado | **10º dia útil do 2º mês** seguinte | RFB | 0,02% ao dia sobre RB, máx 1% |
| **DCTFWeb** | Declaração de débitos previdenciários | Dia **30** do mês seguinte | RFB | Multa + juros |
| **EFD-REINF** | Retenções de terceiros | Dia **15** do mês seguinte | RFB | Multa + juros |
| **PGDAS-D** | Apenas Simples Nacional | Dia **20** | RFB | — (N/A se fora do Simples) |
| **DAS** | Guia do Simples Nacional | Dia **20** | RFB | — (N/A se fora do Simples) |
| **e-Social** | Folha de pagamento, eventos | Variável por evento | RFB | Multa + juros |

#### Obrigações anuais

| Obrigação | O que é | Prazo | Órgão |
|-----------|---------|-------|-------|
| **ECD** (Escrituração Contábil Digital) | Livro contábil digital | Último dia útil de **junho** | RFB |
| **ECF** (Escrituração Contábil Fiscal) | IRPJ/CSLL, mapeamento de contas | Último dia útil de **julho** | RFB |
| **DIRF** | Retenções na fonte | Até **28 de fevereiro** | RFB |
| **RAIS** | Relações Anuais de Informações Sociais | Até **março** (via e-Social) | MTE |

Fontes: [Adejo — Prazos Fiscais 2025](https://news.adejo.com.br/simplifique-2025-os-prazos-fiscais-que-voc%C3%AA-precisa-saber) · [TTAX — Agenda 2025](https://ttax.com.br/agenda-de-obrigacoes-acessorias-2025-principais-atualizacoes/)

---

## PARTE II — REFORMA TRIBUTÁRIA 2026-2033

### 5. Cronograma Ano a Ano

Base legal: [EC 132/2023](https://www.planalto.gov.br/ccivil_03/constituicao/Emendas/Emc/emc132.htm) + [LC 214/2025](https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp214.htm) + [LC 227/2026](https://jusdocs.com/blog/reforma-tributaria-consumo-impactos-juridicos)

| Ano | O que muda na prática | Impacto no ERP |
|-----|-----------------------|----------------|
| **2026** | CBS 0,9% + IBS 0,1% em caráter de **teste**. Obrigações acessórias obrigatórias (campos nas NF-e). PIS/COFINS/ICMS/ISS continuam vigentes integralmente. | Adicionar campos de CBS/IBS na estrutura da NF-e. Sem cobrança efetiva nova. |
| **2027** | CBS com alíquota plena (~8,8%). PIS e COFINS **extintos**. IPI reduzido a zero (exceto ZFM). Imposto Seletivo começa. IBS permanece 0,1%. | Retirar campos PIS/COFINS; implementar CBS. Atualizar cálculo de tributos. |
| **2028** | CBS em operação normal. IBS ainda simbólico. | Estabilização CBS. |
| **2029** | IBS assume 10% da carga tributária. ICMS/ISS reduzidos a 90%. | Começar split de carga entre IBS e ICMS/ISS. |
| **2030** | IBS a 20%. ICMS/ISS a 80%. | Atualizar cálculo de alíquotas. |
| **2031** | IBS a 30%. ICMS/ISS a 70%. | Idem. |
| **2032** | IBS a 40%. ICMS/ISS a 60%. | Idem. |
| **2033** | ICMS e ISS **extintos**. CBS + IBS em operação integral. Split payment obrigatório. | Migração total para o novo sistema. Remoção de campos ICMS/ISS. |

Fonte: [Jettax — Cronograma Transição Tributária](https://www.jettax.com.br/blog/tabela-cronograma-da-transicao-tributaria-2026-a-2033/)

**Atenção 2026:** Bernard Appy confirmou que **não haverá cobrança efetiva de CBS e IBS em 2026** — apenas obrigações acessórias para teste operacional. O campo é obrigatório no XML da NF-e a partir de 01/01/2026, mas o valor recolhido é compensável.

---

### 6. CBS e IBS — O que Substituem e Alíquotas

#### CBS — Contribuição sobre Bens e Serviços

| Atributo | Valor |
|----------|-------|
| **Competência** | Federal |
| **Substitui** | PIS + COFINS |
| **Alíquota de referência** | **8,8%** |
| **Vigência plena** | 2027 |
| **Alíquota de teste (2026)** | 0,9% |
| **Não cumulatividade** | Ampla — crédito sobre insumos, ativo imobilizado, serviços |
| **Café torrado** | **Alíquota zero** (Cesta Básica Nacional — LC 214/2025, Anexo I) |

#### IBS — Imposto sobre Bens e Serviços

| Atributo | Valor |
|----------|-------|
| **Competência** | Estadual + Municipal |
| **Substitui** | ICMS + ISS |
| **Alíquota de referência total** | **17,7%** (estado + município do destino) |
| **Vigência plena** | 2033 |
| **Alíquota de teste (2026)** | 0,1% |
| **Princípio** | Destino — imposto vai pro estado/município onde a mercadoria é consumida |
| **Gestor** | Comitê Gestor do IBS (CG-IBS), instituído pela LC 227/2026 |
| **Café torrado** | **Alíquota zero** (Cesta Básica Nacional) |

Fonte: [Tax Group — IBS/CBS/IS](https://www.taxgroup.com.br/intelligence/reforma-tributaria-guia-completo-sobre-iva-ibs-cbs-e-is/) · [Escola Superior de Contabilidade — LC 214/2025](https://escolasuperioresn.com.br/lcn-214-2025-guia-cbs-ibs-is/)

---

### 7. Imposto Seletivo (IS)

| Atributo | Valor |
|----------|-------|
| **Competência** | Federal |
| **Finalidade** | Extrafiscal — desestimular consumo de produtos nocivos |
| **Vigência** | A partir de 2027 |
| **Incidência única** | Não permite crédito tributário |
| **Repartição** | 40% União + 60% estados e municípios |

**Produtos sujeitos (alíquotas estimadas):**

| Produto | Alíquota |
|---------|---------|
| Cigarro e tabaco | Até 250% |
| Bebidas alcoólicas | 46% a 62% |
| Refrigerantes/bebidas açucaradas | 32% |
| Veículos poluentes | Até 18% |
| Minérios | 0,25% |

**Café NÃO está sujeito ao Imposto Seletivo.** É produto da Cesta Básica Nacional, portanto com alíquota zero de IBS e CBS — e fora do escopo do IS.

---

### 8. Split Payment — Como Afeta o ERP

O split payment é o mecanismo pelo qual o tributo (CBS + IBS) é retido **na origem do pagamento** pelo PSP (banco/fintech) e repassado diretamente ao fisco, sem transitar pelo caixa da empresa.

#### Como funciona na prática

```
[Hoje]
Cliente paga R$ 1.000 → Empresa recebe R$ 1.000 → Recolhe R$ 280 de tributos depois

[Com split payment — 2029+]
Cliente paga R$ 1.000 → PSP retém R$ 280 para o fisco → Empresa recebe R$ 720
```

#### Impacto direto no ERP

1. **Fluxo de caixa:** A empresa não recebe mais o tributo embutido no pagamento. Elimina o "capital de giro tributário". Precisa replanejar o capital de giro.
2. **Conciliação:** A NF-e precisará ter os campos de CBS/IBS preenchidos corretamente para que o PSP calcule o split automaticamente.
3. **Crédito acumulado:** Empresas com muitos créditos (como a Patrocínio que compra café com alíquota zero e vende com alíquota zero) podem ter **crédito a restituir** do fisco — fluxo de caixa positivo.
4. **Reformulação do DRE:** A partir de 2029, o DRE precisa mostrar CBS e IBS como itens destacados, não embutidos no faturamento bruto.

#### Cronograma split payment

| Ano | Status |
|-----|--------|
| 2026 | Opcional (fase de teste) |
| 2027–2028 | Expansão gradual |
| 2029–2032 | Implementação progressiva obrigatória por segmento |
| 2033 | Obrigatório e em operação plena |

Fontes: [CheckSped — Split Payment 2026](https://checksped.com.br/artigos/split-payment-2026-impacto-fiscal/) · [Jettax — Split Payment](https://www.jettax.com.br/blog/split-payment-reforma-tributaria/)

---

### 9. Café Torrado é Cesta Básica Nacional — IMPACTO CRÍTICO

**Esta é a informação fiscal mais importante para a Patrocínio Café.**

O café (em todas as formas — cru, torrado em grão, torrado e moído, solúvel, extratos e concentrados) foi incluído no **Anexo I da LC 214/2025 (Cesta Básica Nacional de Alimentos)** com **alíquota zero de IBS e CBS**.

> "Seguirão com alíquota zero do novo tributo IBS/CBS: café cru, café torrado, café solúvel e extratos, essências e concentrados de café e preparações à base desses extratos, essências ou concentrados ou à base de café." — [CECAFÉ](https://www.cecafe.com.br/publicacoes/noticias/tarifa-cafe-reforma-tributaria-20241219/)

#### Impacto prático no ERP

| Período | O que muda |
|---------|-----------|
| **Até 2026** | Sem mudança. PIS/COFINS continuam (0,65%+3% ou 1,65%+7,6%). ICMS 12% nas saídas internas. |
| **2027** | CBS sobre café torrado = **0%**. PIS e COFINS extintos. Empresa pode ter crédito de CBS sobre insumos. |
| **2029-2033** | IBS sobre café torrado = **0%**. ICMS vai sendo extinto gradualmente. |
| **2033** | Café torrado sai totalmente livre de ICMS e ISS. Carga tributária sobre o produto = **zero**. |

#### O que isso significa para o cálculo de preços

A partir de 2027, o preço de venda do café torrado não precisará mais embutir PIS/COFINS (hoje ~3,65% cumulativo). Isso representa vantagem competitiva: ou a empresa reduz o preço, ou aumenta a margem.

O sistema de precificação do ERP (quando for construído) **deve ter um campo de previsão tributária** que mude automaticamente conforme o ano.

---

### 10. Checklist de Adaptação do ERP para a Reforma

| Item | Prazo | Status |
|------|-------|--------|
| Adicionar campos `valor_cbs` e `valor_ibs` nas tabelas de NF-e | **01/01/2026** | Pendente |
| Preencher CBS=0,9% e IBS=0,1% nas NF-e emitidas (teste) | **01/01/2026** | Pendente |
| Mapear todos os produtos com NCM para confirmar alíquota zero na CBS/IBS | 2026 | Pendente |
| Atualizar Edge Function `nfe-emitir` para incluir campos de CBS/IBS no JSON | **01/01/2026** | Pendente |
| Remover campos PIS/COFINS e substituir por CBS na emissão | **01/01/2027** | Pendente |
| Implementar cálculo de crédito de CBS (Lucro Real) | 2027 | Pendente |
| Reformular DRE para mostrar CBS separadamente | 2027 | Pendente |
| Implementar lógica de split payment no fluxo de recebimento | 2029 | Pendente |

---

## PARTE III — FOCUS NFe API v2 — REFERÊNCIA COMPLETA

### 11. Visão Geral da Focus NFe

#### Dados da empresa

| Campo | Valor |
|-------|-------|
| **Razão Social** | Focus NFe LTDA (Acras Tecnologia da Informação LTDA) |
| **CNPJ** | [07.504.505/0001-32](https://empresas.serasaexperian.com.br/consulta-gratis/FOCUS-NFE-LTDA-07504505000132) |
| **Fundação** | 14 de julho de 2005 (20 anos em 2025) |
| **Sede** | Florianópolis-SC |
| **Site** | [focusnfe.com.br](https://focusnfe.com.br) |
| **Documentação** | [focusnfe.com.br/doc/](https://focusnfe.com.br/doc/) |
| **Status page** | [status.focusnfe.com.br](https://status.focusnfe.com.br) |
| **Suporte** | suporte@focusnfe.com.br |
| **Fórum** | [forum.focusnfe.com.br](https://forum.focusnfe.com.br) |
| **GitHub** | [github.com/FocusNFe](https://github.com/FocusNFe) |
| **Uptime API (2025)** | 100,00% ([status.focusnfe.com.br](https://status.focusnfe.com.br/report/uptime/215962bbc53f4fbc1f2394c288b46e1a/)) |

**Escala:** +1 bilhão de notas processadas · +43.000 empresas · +1.400 prefeituras · +26 estados

#### Planos e preços 2025/2026

**Planos gerais (NF-e, NFS-e, CT-e, MDF-e):**

| Plano | Preço/mês | CNPJs | Notas inclusas | Nota extra | Ideal para |
|-------|-----------|-------|----------------|------------|------------|
| **Solo** | R$ 89,90 | 1 | 100 | R$ 0,10 | Volume baixo, 1 CNPJ |
| **Start** | R$ 113,90 | 3 (+R$37,90/CNPJ) | 100/CNPJ | R$ 0,10 | Poucos CNPJs |
| **Growth** | R$ 548,00 | Ilimitados | 4.000 (pool) | R$ 0,12 | Volume médio-alto |
| **Enterprise** | Consulte | Ilimitados | Negociável | Negociável | >50k notas/mês |

**Planos Retail (foco em NFC-e):**

| Plano | Preço/mês | CNPJs | NFC-e inclusas | NF-e inclusas |
|-------|-----------|-------|----------------|---------------|
| **Retail** | R$ 59,90 | 1 | 500 | 100 |
| **Retail+** | R$ 629,90 | Ilimitados | 9.000 | 1.000 |

**Observações importantes:**
- Sem taxa de setup em todos os planos
- Sem contrato mínimo — cancela sem multa
- 30 dias de teste grátis
- Nova integração municipal NFS-e: R$ 199,00 taxa única (entrega em até 15 dias)

Fonte: [focusnfe.com.br/precos/](https://focusnfe.com.br/precos/)

#### Qual plano para a Patrocínio Café?

**Fase 1 (só NF-e, ~200 notas/mês):** Plano Solo (R$ 89,90/mês) com notas extras a R$ 0,10.

**Fase 3 (NF-e + NFS-e + CT-e + MDF-e):** Plano Growth (R$ 548,00/mês — pool de 4.000 notas).

---

### 12. Cadastro na Focus NFe (Passo a Passo do Zero)

1. Acesse [app-v2.focusnfe.com.br](https://app-v2.focusnfe.com.br/) e crie sua conta com e-mail e senha.
2. Ative o período de teste grátis (30 dias).
3. Navegue em **"Serviços" → "Minhas Empresas"**.
4. Clique em **"Adicionar Empresa"**.
5. Preencha o CNPJ, razão social, endereço, inscrição estadual e regime tributário.
6. Faça upload do **certificado digital A1** (.pfx): em "Editar empresa" → "Anexar Certificado" → selecione o .pfx e informe a senha.
7. O sistema gera automaticamente **dois tokens**: um para homologação e um para produção.
8. Salve ambos os tokens no `.env` do projeto e nos Supabase Secrets.
9. Configure os **webhooks** para o endpoint da Edge Function `focus-webhook`.
10. Teste com uma NF-e de exemplo no ambiente de homologação antes de ir para produção.

Referências: [focusnfe.com.br/guides/configurando-empresa/](https://focusnfe.com.br/guides/configurando-empresa/) · [Tutorial de certificado](https://focusnfe.com.br/blog/como-vincular-o-certificado-digital-modelo-a1-a-empresa-cadastrada/)

---

### 13. Autenticação (Token, Headers, Sandbox vs. Produção)

#### Ambientes

| Ambiente | URL base |
|----------|---------|
| **Homologação (Sandbox)** | `https://homologacao.focusnfe.com.br` |
| **Produção** | `https://api.focusnfe.com.br` |

#### Método

A API usa **HTTP Basic Auth** com o token como username e **senha em branco**.

```bash
# Formato
Authorization: Basic <base64(TOKEN:)>
# Note o dois-pontos após o TOKEN e sem senha
```

#### Tipos de token

| Tipo | Ambiente | Como obter |
|------|----------|-----------|
| **Token de Emissão (Homologação)** | Apenas homologação | Gerado automaticamente ao cadastrar empresa |
| **Token de Emissão (Produção)** | Apenas produção | Gerado automaticamente ao cadastrar empresa |
| **Token de Revenda** | Apenas produção | Para gerenciar empresas via API de Revenda |

Fonte: [forum.focusnfe.com.br/t/autenticacao-e-utilizacao-dos-tokens-da-api-revenda-e-emissao/66](https://forum.focusnfe.com.br/t/autenticacao-e-utilizacao-dos-tokens-da-api-revenda-e-emissao/66)

#### Exemplo em TypeScript (módulo reutilizável)

```typescript
// supabase/functions/_shared/focus-client.ts

export type FocusAmbiente = "homologacao" | "producao";

export interface FocusResponse {
  status?: string;
  status_sefaz?: string;
  mensagem_sefaz?: string;
  ref?: string;
  chave_nfe?: string;
  numero?: string;
  serie?: string;
  protocolo?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_danfe?: string;
  codigo?: string;
  mensagem?: string;
  erros?: Array<{ mensagem: string; campo: string }>;
  url_consulta_qrcode?: string;
  qrcode_url?: string;
}

export class FocusClient {
  private baseUrl: string;
  private token: string;

  constructor(token: string, ambiente: FocusAmbiente = "producao") {
    this.token = token;
    this.baseUrl =
      ambiente === "producao"
        ? "https://api.focusnfe.com.br"
        : "https://homologacao.focusnfe.com.br";
  }

  private getAuthHeader(): string {
    // Deno: btoa é global
    return "Basic " + btoa(`${this.token}:`);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: object
  ): Promise<{ status: number; data: T }> {
    const headers: Record<string, string> = {
      Authorization: this.getAuthHeader(),
      "Content-Type": "application/json",
    };

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Loga rate limit info
    const rateLimitRemaining = res.headers.get("Rate-Limit-Remaining");
    if (rateLimitRemaining && parseInt(rateLimitRemaining) < 10) {
      console.warn(`[FocusClient] Rate limit baixo: ${rateLimitRemaining} restantes`);
    }

    if (res.status === 429) {
      const resetSec = res.headers.get("Rate-Limit-Reset") ?? "60";
      throw new Error(`Rate limit atingido. Reset em ${resetSec}s`);
    }

    const data = await res.json() as T;
    return { status: res.status, data };
  }

  // NF-e
  async emitirNFe(ref: string, dados: object): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/nfe?ref=${encodeURIComponent(ref)}`,
      dados
    );
    return data;
  }

  async consultarNFe(ref: string): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>("GET", `/v2/nfe/${encodeURIComponent(ref)}`);
    return data;
  }

  async cancelarNFe(ref: string, justificativa: string): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "DELETE",
      `/v2/nfe/${encodeURIComponent(ref)}`,
      { justificativa }
    );
    return data;
  }

  async cartaCorrecao(ref: string, correcao: string): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/nfe/${encodeURIComponent(ref)}/carta_correcao`,
      { correcao }
    );
    return data;
  }

  async inutilizarNFe(cnpj: string, serie: string, numInicial: string, numFinal: string, justificativa: string): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>("POST", "/v2/nfe/inutilizacao", {
      cnpj, serie, numero_inicial: numInicial, numero_final: numFinal, justificativa,
    });
    return data;
  }

  // NFC-e
  async emitirNFCe(ref: string, dados: object): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/nfce?ref=${encodeURIComponent(ref)}`,
      dados
    );
    return data;
  }

  async cancelarNFCe(ref: string, justificativa: string): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "DELETE",
      `/v2/nfce/${encodeURIComponent(ref)}`,
      { justificativa }
    );
    return data;
  }

  // NFS-e
  async emitirNFSe(ref: string, dados: object): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/nfse?ref=${encodeURIComponent(ref)}`,
      dados
    );
    return data;
  }

  async cancelarNFSe(ref: string, motivo: string): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "DELETE",
      `/v2/nfse/${encodeURIComponent(ref)}`,
      { motivo }
    );
    return data;
  }

  // CT-e
  async emitirCTe(ref: string, dados: object): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/cte?ref=${encodeURIComponent(ref)}`,
      dados
    );
    return data;
  }

  // MDF-e
  async emitirMDFe(ref: string, dados: object): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/mdfe?ref=${encodeURIComponent(ref)}`,
      dados
    );
    return data;
  }

  async encerrarMDFe(ref: string, payload: object): Promise<FocusResponse> {
    const { data } = await this.request<FocusResponse>(
      "POST",
      `/v2/mdfe/${encodeURIComponent(ref)}/encerrar`,
      payload
    );
    return data;
  }

  // Webhooks
  async criarWebhook(cnpj: string, event: string, url: string): Promise<object> {
    const { data } = await this.request<object>("POST", "/v2/hooks", { cnpj, event, url });
    return data;
  }

  async listarWebhooks(): Promise<object[]> {
    const { data } = await this.request<object[]>("GET", "/v2/hooks");
    return data;
  }

  async deletarWebhook(id: string): Promise<void> {
    await this.request<void>("DELETE", `/v2/hooks/${id}`);
  }
}
```

---

### 14. Endpoint NF-e Modelo 55 — JSON Completo

#### Endpoints disponíveis

| Método | Endpoint | Ação |
|--------|----------|------|
| `POST` | `/v2/nfe?ref=REF` | Autorizar (enviar) NF-e |
| `GET` | `/v2/nfe/REF` | Consultar status |
| `DELETE` | `/v2/nfe/REF` | Cancelar |
| `POST` | `/v2/nfe/REF/carta_correcao` | Emitir CC-e |
| `POST` | `/v2/nfe/inutilizacao` | Inutilizar numeração |
| `POST` | `/v2/nfe/REF/email` | Enviar por e-mail |
| `POST` | `/v2/nfe/REF/econf` | Evento de Conciliação Financeira |

Referência: [focusnfe.com.br/doc/](https://focusnfe.com.br/doc/)

#### Status possíveis da NF-e

| Status | Significado |
|--------|------------|
| `processando_autorizacao` | Sendo processada pela SEFAZ |
| `autorizado` | Autorizada com sucesso |
| `erro_autorizacao` | Rejeitada pela SEFAZ (ver `mensagem_sefaz`) |
| `cancelado` | Cancelada |
| `denegado` | Denegada (irregularidade cadastral do emitente) |

#### JSON completo — Venda de café torrado (intraestadual GO→GO)

```json
{
  "natureza_operacao": "Venda de Mercadoria",
  "data_emissao": "2026-01-15T08:00:00-03:00",
  "data_entrada_saida": "2026-01-15T08:00:00-03:00",
  "tipo_documento": "1",
  "finalidade_emissao": "1",
  "consumidor_final": "0",
  "presenca_comprador": "9",
  "local_destino": "1",
  "regime_tributario_emitente": "3",
  "cnpj_emitente": "SEU_CNPJ_SEM_PONTUACAO",
  "nome_emitente": "PATROCINIO CAFE LTDA",
  "nome_fantasia_emitente": "PATROCINIO CAFE",
  "logradouro_emitente": "RUA DAS TORREFACOES",
  "numero_emitente": "100",
  "bairro_emitente": "SETOR INDUSTRIAL",
  "municipio_emitente": "Goiania",
  "uf_emitente": "GO",
  "cep_emitente": "74000000",
  "telefone_emitente": "62900000000",
  "inscricao_estadual_emitente": "SEU_IE",
  "cnpj_destinatario": "CNPJ_DESTINATARIO",
  "nome_destinatario": "CAFETERIA CLIENTE LTDA",
  "inscricao_estadual_destinatario": "IE_DESTINATARIO",
  "indicador_inscricao_estadual_destinatario": "1",
  "logradouro_destinatario": "AV DO CAFE",
  "numero_destinatario": "200",
  "bairro_destinatario": "CENTRO",
  "municipio_destinatario": "Goiania",
  "uf_destinatario": "GO",
  "cep_destinatario": "74001000",
  "email_destinatario": "fiscal@cliente.com.br",
  "icms_base_calculo": "0.00",
  "icms_valor_total": "0.00",
  "icms_base_calculo_st": "0.00",
  "icms_valor_total_st": "0.00",
  "valor_produtos": "3000.00",
  "valor_frete": "0.00",
  "valor_seguro": "0.00",
  "valor_desconto": "0.00",
  "valor_outras_despesas": "0.00",
  "valor_ipi": "0.00",
  "valor_pis": "0.00",
  "valor_cofins": "0.00",
  "valor_total": "3000.00",
  "modalidade_frete": "9",
  "formas_pagamento": [
    {
      "forma_pagamento": "15",
      "valor_pagamento": "3000.00"
    }
  ],
  "items": [
    {
      "numero_item": "1",
      "codigo_produto": "CAFE-TORRADO-001",
      "descricao": "Cafe Torrado em Grao - Arabica",
      "cfop": "5101",
      "unidade_comercial": "KG",
      "quantidade_comercial": "100.000",
      "valor_unitario_comercial": "30.00",
      "valor_bruto": "3000.00",
      "valor_desconto": "0.00",
      "unidade_tributavel": "KG",
      "codigo_ncm": "09012100",
      "quantidade_tributavel": "100.000",
      "valor_unitario_tributavel": "30.00",
      "inclui_no_total": "1",
      "icms_origem": "0",
      "icms_situacao_tributaria": "000",
      "icms_modalidade_base_calculo": "3",
      "icms_base_calculo": "3000.00",
      "icms_aliquota": "12.00",
      "icms_valor": "360.00",
      "pis_situacao_tributaria": "01",
      "pis_base_calculo": "3000.00",
      "pis_aliquota_percentual": "0.65",
      "pis_valor": "19.50",
      "cofins_situacao_tributaria": "01",
      "cofins_base_calculo": "3000.00",
      "cofins_aliquota_percentual": "3.00",
      "cofins_valor": "90.00"
    }
  ],
  "informacoes_adicionais_contribuinte": "Produto: Cafe Torrado Arabica - NCM 0901.21.00. CFOP 5101 - Venda de producao propria."
}
```

> **Nota sobre CST:** Para Lucro Presumido com ICMS calculado normalmente (CST 000 = tributado integralmente). Se a empresa tiver redução de base de cálculo para café em GO, use CST 020. Se for Simples Nacional (inviável conforme análise, mas se acontecer): use CSOSN 102.

#### Resposta de sucesso

```json
{
  "cnpj_emitente": "SEU_CNPJ",
  "ref": "SUA_REFERENCIA",
  "status": "autorizado",
  "status_sefaz": "100",
  "mensagem_sefaz": "Autorizado o uso da NF-e",
  "chave_nfe": "52260101234567890001550010000001231234567890",
  "numero": "123",
  "serie": "1",
  "protocolo": "152260000001234",
  "caminho_xml_nota_fiscal": "/arquivos/CNPJ/202601/XMLs/...nfe.xml",
  "caminho_danfe": "/arquivos/CNPJ/202601/DANFEs/....pdf"
}
```

---

### 15. Endpoint NFC-e Modelo 65 — JSON Completo + QR Code

#### Diferenças NF-e vs NFC-e

| Aspecto | NF-e (55) | NFC-e (65) |
|---------|-----------|------------|
| Destinatário | Obrigatório | Opcional (anônimo) |
| Processamento | Assíncrono | **Síncrono** |
| QR Code | Não | **Obrigatório** |
| Uso | B2B | Varejo presencial |
| Série | 001–889 | **890–999** |
| Contingência | SVC/EPEC | **EPEC** |
| Fase de implantação | Fase 1 | **Fase 2** |

> **ATENÇÃO:** NFC-e entra na Fase 2. Não implemente antes.

#### Endpoints NFC-e

| Método | Endpoint | Ação |
|--------|----------|------|
| `POST` | `/v2/nfce?ref=REF` | Emitir (síncrono) |
| `GET` | `/v2/nfce/REF` | Consultar |
| `DELETE` | `/v2/nfce/REF` | Cancelar |
| `POST` | `/v2/nfce/inutilizacao` | Inutilizar |

#### JSON completo — Venda balcão (consumidor final, 500g café)

```json
{
  "cnpj_emitente": "SEU_CNPJ",
  "data_emissao": "2026-01-15T14:30:00-03:00",
  "natureza_operacao": "VENDA AO CONSUMIDOR",
  "indicador_inscricao_estadual_destinatario": "9",
  "modalidade_frete": "9",
  "local_destino": "1",
  "presenca_comprador": "1",
  "formas_pagamento": [
    {
      "forma_pagamento": "03",
      "valor_pagamento": "40.00",
      "bandeira_operadora": "01",
      "numero_autorizacao": "123456"
    }
  ],
  "items": [
    {
      "numero_item": "1",
      "codigo_ncm": "09012200",
      "codigo_produto": "CAFE-MOIDO-500G",
      "descricao": "Cafe Torrado e Moido - 500g",
      "cfop": "5102",
      "unidade_comercial": "UN",
      "quantidade_comercial": "1.000",
      "valor_unitario_comercial": "40.00",
      "valor_unitario_tributavel": "40.00",
      "unidade_tributavel": "UN",
      "quantidade_tributavel": "1.000",
      "valor_bruto": "40.00",
      "valor_desconto": "0.00",
      "icms_origem": "0",
      "icms_situacao_tributaria": "400",
      "pis_situacao_tributaria": "07",
      "cofins_situacao_tributaria": "07",
      "valor_total_tributos": "6.52"
    }
  ]
}
```

**Formas de pagamento mais comuns:**

| Código | Descrição |
|--------|-----------|
| `01` | Dinheiro |
| `03` | Cartão de Crédito |
| `04` | Cartão de Débito |
| `99` | Outros (PIX via QR Code) |

#### Resposta NFC-e (com QR Code)

```json
{
  "status": "autorizado",
  "chave_nfe": "52260501234567890001650890000001231234567890",
  "url_consulta_qrcode": "https://www.sefaz.go.gov.br/nfce/consulta?...",
  "qrcode_url": "https://api.focusnfe.com.br/arquivos/.../qrcode.png",
  "caminho_xml_nota_fiscal": "/arquivos/.../xml/...-nfe.xml",
  "caminho_danfe": "/arquivos/.../DANFE/...pdf"
}
```

---

### 16. Endpoint NFS-e Goiânia (ABRASF/AmTec/GINFES) — JSON Completo

#### Padrão de Goiânia

| Dado | Valor |
|------|-------|
| **Padrão** | ABRASF 2.04 (modificado — provedor AmTec/GINFES) |
| **Regulamentação** | Decreto Municipal nº 2.824/2025 (vigência 01/10/2025) |
| **Sistema** | SGISS — [issnetonline.com.br/goiania](https://www.issnetonline.com.br/goiania/online/login/login.aspx) |
| **Código IBGE** | 5208707 |
| **Emissor gratuito** | Encerrado em dezembro/2025 |

Fonte: [NFSRápida — Novo padrão Goiânia](https://nfsrapida.com.br/blog/novo-padrao-emissao-nfs-goiania/) · [TOTVS — NFS-e Nacional Goiânia](https://www.totvs.com/blog/fiscal-clientes/nfs-e-nacional-goiania-ajusta-padrao-as-regras-exigidas-na-reforma-tributaria/)

#### Quando emitir NFS-e (Fase 3)

A NFS-e em Goiânia é para a **maquinação AGB** — quando a Patrocínio Café presta o serviço de torra para outra marca (private label) onde o encomendante fornece o café cru. Entra apenas na Fase 3.

#### JSON completo — NFS-e torra por encomenda (serviço de industrialização)

```json
{
  "data_emissao": "2026-01-15T10:00:00-0300",
  "natureza_operacao": 1,
  "optante_simples_nacional": false,
  "regime_especial_tributacao": 0,
  "prestador": {
    "cnpj": "SEU_CNPJ",
    "inscricao_municipal": "SUA_INSCRICAO_MUNICIPAL_GOIANIA",
    "codigo_municipio": 5208707
  },
  "tomador": {
    "cnpj": "CNPJ_TOMADOR",
    "razao_social": "CAFETERIA MARCA X LTDA",
    "email": "fiscal@marcax.com.br",
    "endereco": {
      "logradouro": "RUA DO ENCOMENDANTE",
      "numero": "100",
      "bairro": "JARDIM GOIAS",
      "codigo_municipio": 5208707,
      "uf": "GO",
      "cep": "74000-000"
    },
    "telefone": "62900000001"
  },
  "servico": {
    "discriminacao": "Servicos de industrializacao por encomenda — torra e beneficiamento de cafe arabica conforme pedido n. 2026-0042. Cafe cru fornecido pelo tomador retorna ao encomendante apos processo de torrefacao. CFOP 5124. NCM 0901.21.00.",
    "valor_servicos": 800.00,
    "aliquota": 5.0,
    "item_lista_servico": "14.05",
    "codigo_tributario_municipio": "14.05",
    "codigo_cnae": "1031700",
    "iss_retido": false,
    "base_calculo": 800.00,
    "valor_iss": 40.00,
    "valor_liquido": 800.00
  }
}
```

> **Atenção fiscal:** Para torra por encomenda com posterior comercialização pelo encomendante, o STF decidiu que incide ICMS (não ISS) sobre o valor agregado. O campo `iss_retido: false` e a `discriminacao` detalhada são fundamentais para evitar autuação. Consulte o contador antes de emitir em produção.

---

### 17. Endpoint CT-e (Transporte Café MG→GO)

O CT-e é emitido pela **transportadora** (não pela Patrocínio Café). Relevante para a Fase 3 quando a Patrocínio gerenciar o transporte do café cru vindo de Minas Gerais.

#### Quando a Patrocínio precisa de CT-e

- Se contratar transporte próprio ou de terceiros para buscar café cru em MG
- O CT-e referencia a NF-e de compra do café cru

#### JSON resumido — CT-e Rodoviário MG→GO

```json
{
  "cfop": "6353",
  "natureza_operacao": "PRESTACAO DE SERVICO DE TRANSPORTE",
  "data_emissao": "2026-01-15T06:00:00-03:00",
  "tipo_documento": 0,
  "tipo_servico": 0,
  "codigo_municipio_envio": "3106200",
  "municipio_envio": "Belo Horizonte",
  "uf_envio": "MG",
  "codigo_municipio_inicio": 3106200,
  "municipio_inicio": "Belo Horizonte",
  "uf_inicio": "MG",
  "codigo_municipio_fim": "5208707",
  "municipio_fim": "Goiania",
  "uf_fim": "GO",
  "tomador": "3",
  "cnpj_emitente": "CNPJ_TRANSPORTADORA",
  "nome_emitente": "CT-E EMITIDO EM HOMOLOGACAO - SEM VALOR FISCAL",
  "inscricao_estadual_emitente": "IE_TRANSPORTADORA",
  "valor_total": "350.00",
  "valor_receber": "350.00",
  "icms_situacao_tributaria": "00",
  "icms_base_calculo": "350.00",
  "icms_aliquota": "12.00",
  "icms_valor": "42.00",
  "produto_predominante": "Cafe cru arabica",
  "nfes": [
    {
      "chave_nfe": "CHAVE_NFE_DE_COMPRA_DO_CAFE",
      "data_prevista": "2026-01-16"
    }
  ]
}
```

---

### 18. Endpoint MDF-e (Manifesto)

O MDF-e é o "passaporte" do veículo para viagens interestaduais. Emitido pela transportadora ou pela empresa que faz transporte próprio.

#### Quando usar

- Caminhão da Patrocínio (ou transportadora contratada) sai de GO para buscar café em MG
- Deve listar todos os CT-es e NF-es que o veículo carrega

#### Endpoints MDF-e

| Método | Endpoint | Ação |
|--------|----------|------|
| `POST` | `/v2/mdfe?ref=REF` | Emitir |
| `POST` | `/v2/mdfe/REF/encerrar` | Encerrar ao chegar no destino |
| `POST` | `/v2/mdfe/REF/inclusao_condutor` | Adicionar condutor |

#### Encerramento (obrigatório ao chegar no destino)

```json
{
  "data_encerramento": "2026-01-15T18:00:00-03:00",
  "codigo_municipio": "5208707",
  "municipio": "Goiania",
  "uf": "GO"
}
```

---

### 19. Webhooks (Eventos, Payload, Validação, Retry)

#### Configuração via API

```bash
POST /v2/hooks
{
  "cnpj": "SEU_CNPJ",
  "event": "nfe",
  "url": "https://SEU_PROJETO.supabase.co/functions/v1/focus-webhook"
}
```

#### Eventos disponíveis

| Evento | Quando dispara |
|--------|---------------|
| `nfe` | NF-e processada (autorizada, rejeitada, cancelada, denegada) |
| `nfce_contingencia` | Entrada/saída de contingência NFC-e |
| `nfse` | NFS-e processada |
| `nfe_recebida` | NF-e emitida **contra o seu CNPJ** (você é o destinatário) |
| `nfse_recebida` | NFS-e tomada recebida |
| `cte_recebida` | CT-e recebido |
| `inutilizacao` | Inutilização processada |
| `cte` | CT-e processado |
| `mdfe` | MDF-e processado |

#### Headers enviados pela Focus

```http
POST /webhooks/nfe HTTP/1.1
Content-Type: application/json
User-Agent: FocusNFe/2.0
Authorization: Basic <base64(TOKEN:)>
```

A Focus envia o **mesmo token** no header `Authorization`. Valide sempre.

#### Retry policy

- Tentativas: intervalos crescentes
- Desistência após: **48 horas** sem resposta do seu servidor
- **O seu endpoint deve responder com HTTP 2xx em menos de 2 segundos.** Processar em background.

---

### 20. Rate Limits e Tratamento de Erros

#### Limites

| Parâmetro | Valor |
|-----------|-------|
| Limite padrão | **100 requisições/minuto** por token |
| Janela de reset | 60 segundos |

#### Headers de rate limit em toda resposta

| Header | Significado |
|--------|------------|
| `Rate-Limit-Limit` | Total de créditos no período |
| `Rate-Limit-Remaining` | Créditos restantes |
| `Rate-Limit-Reset` | Segundos até o reset |

#### Tratamento no cliente TypeScript

```typescript
// Exponential backoff para erros temporários SEFAZ
async function emitirComRetry(
  client: FocusClient,
  ref: string,
  dados: object,
  maxRetries = 3
): Promise<FocusResponse> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await client.emitirNFe(ref, dados);

      // Erros definitivos (validação) — não retentam
      if (result.status_sefaz && parseInt(result.status_sefaz) < 500) {
        return result;
      }

      // Erros temporários SEFAZ (código 999 = serviço indisponível)
      if (result.status_sefaz === "999" && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 5000; // 5s, 10s, 20s
        console.warn(`[retry ${attempt + 1}] Erro SEFAZ 999. Aguardando ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      return result;
    } catch (e) {
      if (String(e).includes("Rate limit") && attempt < maxRetries) {
        const resetMatch = String(e).match(/(\d+)s/);
        const delay = resetMatch ? parseInt(resetMatch[1]) * 1000 : 60000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
  }
  throw new Error(`Máximo de ${maxRetries} tentativas excedido para ref: ${ref}`);
}
```

---

### 21. Os 20 Códigos SEFAZ Mais Comuns e Como Tratar

| Código | Descrição | Causa | Como tratar |
|--------|-----------|-------|-------------|
| **100** | Autorizado o uso da NF-e | — | Sucesso |
| **204** | Duplicidade de NF-e | Chave já autorizada | Não retransmita; consulte a nota |
| **207** | CNPJ emitente inválido | Dígito verificador errado | Valide CNPJ com algoritmo mod11 |
| **209** | IE emitente inválida | Número de IE incorreto | Consulte SINTEGRA |
| **213** | CNPJ certificado ≠ emitente | Certificado de outra empresa | Atualize o certificado A1 na Focus |
| **215** | Falha no schema XML | Campo obrigatório ausente | Verifique o campo indicado no erro |
| **229** | IE emitente não informada | Campo ausente | Preencha `inscricao_estadual_emitente` |
| **245** | CNPJ emitente não cadastrado | CNPJ irregular na SEFAZ | Regularize junto à SEFAZ estadual |
| **252** | Ambiente divergente | Nota de prod enviada pra homologação | Use o token correto do ambiente |
| **301** | IE destinatário não cadastrada | IE inválida | Use `indicador_inscricao_estadual_destinatario: "9"` se não contribuinte |
| **486** | Grupo de autorização não informado | UF exige CPF/CNPJ do contador | Adicione `pessoas_autorizadas` |
| **532** | Total ICMS ≠ somatório dos itens | Soma manual incorreta | Recalcule `icms_valor_total` |
| **539** | Duplicidade com chave diferente | Número já emitido em outro sistema | Contate suporte Focus |
| **564** | Total produtos ≠ soma dos itens | `valor_produtos` incorreto | Corrija = soma de todos `valor_bruto` |
| **590** | CST inválido para Simples Nacional | CRT=1 com CST de regime normal | Use CSOSN correto |
| **728** | IE destinatário não informada | `indicador_inscricao_estadual_destinatario = 1` sem IE | Preencha a IE ou mude o indicador para 9 |
| **732** | CFOP interestadual com destino interno | CFOP 6xxx com `local_destino = 1` | Verifique: 5xxx=intraestadual, 6xxx=interestadual |
| **203** | Emissor não habilitado | CNPJ não autorizado na SEFAZ | Solicite autorização à SEFAZ estadual |
| **999** | Erro interno SEFAZ | Serviço temporariamente indisponível | Aguarde e tente (exponential backoff) |

Fontes: [Guia de problemas NF-e — Focus NFe](https://focusnfe.com.br/guides/problemas-nfe/) · [Tabela de rejeições SEFAZ](https://novisistemas.freshdesk.com/support/solutions/articles/42000102509)

---

### 22. Contingência (EPEC, FS-DA, SVC)

| Modalidade | Quando usar | Prazo transmissão | Disponível para |
|------------|-------------|-------------------|-----------------|
| **FS-DA** | Falha técnica local ou da SEFAZ | Imediato após restabelecimento | NF-e modelo 55 |
| **EPEC** | SEFAZ da UF inacessível | Até **7 dias** após o EPEC | NF-e e CT-e |
| **SVC** | SEFAZ aciona o servidor de contingência nacional | Indicado pela SEFAZ (campo `tpEmis` = 6 ou 7) | NF-e |
| **Offline NFC-e** | SEFAZ fora do ar no PDV | Até **24h** (Goiás) | NFC-e |

**Monitoramento de contingência:** [status.focusnfe.com.br](https://status.focusnfe.com.br) monitora disponibilidade de cada SEFAZ estadual em tempo real.

---

## PARTE IV — SCHEMA SUPABASE FISCAL

### 23. Diagrama Lógico das Tabelas Fiscais

```
empresas_emitentes
    │
    ├─── certificados_digitais (1:N)
    │
    ├─── nfe_status (1:N)
    │        └─── nfe_itens (1:N)
    │        └─── nfe_eventos (1:N) ← cancelamento, CC-e, manifestação
    │
    ├─── nfce_status (1:N)
    │
    ├─── nfse_status (1:N)
    │
    ├─── cte_status (1:N)
    │
    └─── mdfe_status (1:N)

xml_recebidos (NF-e recebidas/destinatário)
catalogo_ncm
catalogo_cfop
catalogo_cst
catalogo_municipios
```

---

### 24. Migrations SQL Completas

#### Migration 0001 — Tabelas fiscais base

```sql
-- Migration 0001_fiscal_base.sql
-- Criação das tabelas fiscais do ERP Patrocínio Café
-- Execute no Supabase SQL Editor (em ordem)

-- Habilita extensão UUID
create extension if not exists "pgcrypto";

-- =========================================================
-- EMPRESAS EMITENTES
-- =========================================================
create table if not exists public.empresas_emitentes (
  id              uuid primary key default gen_random_uuid(),
  cnpj            varchar(14) not null unique,
  razao_social    varchar(150) not null,
  nome_fantasia   varchar(60),
  logradouro      varchar(60) not null,
  numero          varchar(60) not null,
  complemento     varchar(60),
  bairro          varchar(60) not null,
  municipio       varchar(60) not null,
  uf              char(2) not null,
  cep             varchar(8) not null,
  telefone        varchar(15),
  email           varchar(100),
  inscricao_estadual varchar(14),
  inscricao_municipal varchar(15),
  regime_tributario smallint not null default 3,
    -- 1 = Simples Nacional, 2 = Simples Excesso, 3 = Regime Normal
  ativo           boolean not null default true,
  focus_token_homologacao text,
  focus_token_producao    text,
  ambiente        varchar(12) not null default 'homologacao',
    -- 'homologacao' | 'producao'
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.empresas_emitentes is
  'Empresas cadastradas como emitentes na Focus NFe';

-- =========================================================
-- CERTIFICADOS DIGITAIS
-- =========================================================
create table if not exists public.certificados_digitais (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id) on delete cascade,
  nome_arquivo    varchar(100) not null,
  validade        date not null,
  cn              varchar(200),
    -- Common Name do certificado (razão social vinculada)
  serial          varchar(60),
  enviado_focus   boolean not null default false,
  data_envio_focus timestamptz,
  ativo           boolean not null default true,
  alerta_enviado  boolean not null default false,
    -- true quando alerta de vencimento foi disparado
  created_at      timestamptz not null default now()
);

comment on table public.certificados_digitais is
  'Certificados A1 (.pfx) das empresas emitentes';

-- =========================================================
-- STATUS NF-e MODELO 55
-- =========================================================
create table if not exists public.nfe_status (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id),
  ref             varchar(50) not null,
    -- Referência única enviada pra Focus NFe
  status          varchar(30) not null default 'processando_autorizacao',
    -- processando_autorizacao | autorizado | erro_autorizacao | cancelado | denegado
  status_sefaz    varchar(10),
  mensagem_sefaz  text,
  chave_nfe       varchar(44) unique,
  numero          varchar(9),
  serie           varchar(3),
  protocolo       varchar(15),
  natureza_operacao varchar(60),
  data_emissao    timestamptz,
  valor_total     numeric(15,2),
  valor_produtos  numeric(15,2),
  cnpj_destinatario varchar(14),
  nome_destinatario varchar(150),
  uf_destinatario  char(2),
  caminho_xml     text,
  caminho_danfe   text,
  xml_content     text,
    -- XML completo da NF-e (armazenado após download)
  ambiente        varchar(12) not null default 'homologacao',
  tentativas      smallint not null default 0,
  ultima_consulta timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (empresa_id, ref)
);

comment on table public.nfe_status is
  'Status e metadados de cada NF-e emitida via Focus NFe';

-- =========================================================
-- ITENS DA NF-e
-- =========================================================
create table if not exists public.nfe_itens (
  id              uuid primary key default gen_random_uuid(),
  nfe_id          uuid not null references public.nfe_status(id) on delete cascade,
  numero_item     smallint not null,
  codigo_produto  varchar(60),
  descricao       varchar(120) not null,
  ncm             varchar(8) not null,
  cfop            varchar(4) not null,
  unidade         varchar(6) not null,
  quantidade      numeric(15,4) not null,
  valor_unitario  numeric(15,10) not null,
  valor_bruto     numeric(15,2) not null,
  valor_desconto  numeric(15,2) not null default 0,
  icms_cst        varchar(3),
  icms_origem     smallint,
  icms_aliquota   numeric(5,2),
  icms_valor      numeric(15,2),
  pis_cst         varchar(2),
  pis_aliquota    numeric(5,2),
  pis_valor       numeric(15,2),
  cofins_cst      varchar(2),
  cofins_aliquota numeric(5,2),
  cofins_valor    numeric(15,2),
  created_at      timestamptz not null default now()
);

-- =========================================================
-- EVENTOS NF-e (Cancelamento, CC-e, Manifestação)
-- =========================================================
create table if not exists public.nfe_eventos (
  id              uuid primary key default gen_random_uuid(),
  nfe_id          uuid not null references public.nfe_status(id) on delete cascade,
  tipo_evento     varchar(6) not null,
    -- 110111=cancelamento, 110110=CC-e, 210200=confirmacao, 210210=ciencia, 210220=desconhecimento, 210240=nao_realizada
  sequencia       smallint not null default 1,
  descricao       varchar(60),
    -- "Cancelamento", "CC-e 1", "Ciência da Operação", etc.
  justificativa   text,
  correcao        text,
  status          varchar(20) not null default 'pendente',
    -- pendente | enviado | autorizado | rejeitado
  status_sefaz    varchar(10),
  mensagem_sefaz  text,
  protocolo       varchar(15),
  data_evento     timestamptz,
  created_at      timestamptz not null default now()
);

-- =========================================================
-- STATUS NFC-e MODELO 65
-- =========================================================
create table if not exists public.nfce_status (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id),
  ref             varchar(50) not null,
  status          varchar(30) not null default 'processando_autorizacao',
  status_sefaz    varchar(10),
  mensagem_sefaz  text,
  chave_nfe       varchar(44) unique,
  numero          varchar(9),
  serie           varchar(3),
  protocolo       varchar(15),
  data_emissao    timestamptz,
  valor_total     numeric(15,2),
  url_qrcode      text,
  caminho_xml     text,
  caminho_danfe   text,
  ambiente        varchar(12) not null default 'homologacao',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (empresa_id, ref)
);

-- =========================================================
-- STATUS NFS-e
-- =========================================================
create table if not exists public.nfse_status (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id),
  ref             varchar(50) not null,
  status          varchar(30) not null default 'processando_autorizacao',
  status_sefaz    varchar(10),
  mensagem_sefaz  text,
  numero_nfse     varchar(20),
  codigo_verificacao varchar(20),
  data_emissao    timestamptz,
  valor_servicos  numeric(15,2),
  valor_iss       numeric(15,2),
  cnpj_tomador    varchar(14),
  nome_tomador    varchar(150),
  discriminacao   text,
  caminho_xml     text,
  caminho_pdf     text,
  ambiente        varchar(12) not null default 'homologacao',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (empresa_id, ref)
);

-- =========================================================
-- STATUS CT-e
-- =========================================================
create table if not exists public.cte_status (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id),
  ref             varchar(50) not null,
  status          varchar(30) not null default 'processando_autorizacao',
  status_sefaz    varchar(10),
  mensagem_sefaz  text,
  chave_cte       varchar(44) unique,
  numero          varchar(9),
  serie           varchar(3),
  protocolo       varchar(15),
  data_emissao    timestamptz,
  municipio_origem varchar(7),
  municipio_destino varchar(7),
  uf_origem       char(2),
  uf_destino      char(2),
  valor_total     numeric(15,2),
  produto_predominante varchar(120),
  caminho_xml     text,
  ambiente        varchar(12) not null default 'homologacao',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (empresa_id, ref)
);

-- =========================================================
-- STATUS MDF-e
-- =========================================================
create table if not exists public.mdfe_status (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id),
  ref             varchar(50) not null,
  status          varchar(30) not null default 'processando_autorizacao',
  status_sefaz    varchar(10),
  mensagem_sefaz  text,
  chave_mdfe      varchar(44) unique,
  numero          varchar(9),
  serie           varchar(3),
  protocolo       varchar(15),
  data_emissao    timestamptz,
  uf_carregamento char(2),
  placa_veiculo   varchar(8),
  encerrado       boolean not null default false,
  data_encerramento timestamptz,
  caminho_xml     text,
  ambiente        varchar(12) not null default 'homologacao',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (empresa_id, ref)
);

-- =========================================================
-- XML RECEBIDOS (NF-e destinadas ao CNPJ da Patrocínio)
-- =========================================================
create table if not exists public.xml_recebidos (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas_emitentes(id),
  chave_nfe       varchar(44) not null unique,
  cnpj_emitente   varchar(14) not null,
  nome_emitente   varchar(150),
  numero          varchar(9),
  serie           varchar(3),
  data_emissao    timestamptz,
  valor_total     numeric(15,2),
  natureza_operacao varchar(60),
  xml_content     text,
  status_manifestacao varchar(20) not null default 'pendente',
    -- pendente | ciencia_enviada | confirmado | nao_realizado | desconhecido
  data_manifestacao timestamptz,
  lancado_contas_pagar boolean not null default false,
  conta_pagar_id  uuid,
    -- FK para tabela de contas a pagar (fora do escopo fiscal)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.xml_recebidos is
  'NF-e recebidas (emitidas por terceiros com a Patrocínio como destinatária)';

-- =========================================================
-- CATÁLOGOS FISCAIS
-- =========================================================
create table if not exists public.catalogo_ncm (
  codigo          varchar(8) primary key,
  descricao       text not null,
  aliquota_ipi    numeric(5,2) not null default 0,
  cest            varchar(7),
  observacoes     text,
  updated_at      timestamptz not null default now()
);

create table if not exists public.catalogo_cfop (
  codigo          varchar(4) primary key,
  descricao       text not null,
  tipo            char(1) not null,
    -- 'E' = Entrada, 'S' = Saída
  operacao        varchar(20),
    -- 'intraestadual' | 'interestadual' | 'exterior'
  observacoes     text
);

create table if not exists public.catalogo_cst (
  codigo          varchar(3) primary key,
  tipo            varchar(10) not null,
    -- 'ICMS' | 'PIS' | 'COFINS' | 'IPI' | 'CSOSN'
  descricao       text not null
);

create table if not exists public.catalogo_municipios (
  codigo_ibge     varchar(7) primary key,
  nome            varchar(60) not null,
  uf              char(2) not null,
  capital         boolean not null default false
);

-- =========================================================
-- FUNÇÃO: updated_at automático
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Aplica o trigger nas tabelas que têm updated_at
do $$
declare
  t text;
begin
  foreach t in array array[
    'empresas_emitentes', 'nfe_status', 'nfce_status',
    'nfse_status', 'cte_status', 'mdfe_status', 'xml_recebidos'
  ] loop
    execute format(
      'create trigger trg_%s_updated_at before update on public.%s
       for each row execute procedure public.set_updated_at()',
      t, t
    );
  end loop;
end;
$$;
```

---

### 25. RLS (Row Level Security) — Políticas Completas

```sql
-- Migration 0002_fiscal_rls.sql

-- Habilita RLS em todas as tabelas fiscais
alter table public.empresas_emitentes enable row level security;
alter table public.certificados_digitais enable row level security;
alter table public.nfe_status enable row level security;
alter table public.nfe_itens enable row level security;
alter table public.nfe_eventos enable row level security;
alter table public.nfce_status enable row level security;
alter table public.nfse_status enable row level security;
alter table public.cte_status enable row level security;
alter table public.mdfe_status enable row level security;
alter table public.xml_recebidos enable row level security;

-- Política base: usuários autenticados veem apenas dados da própria empresa
-- Assumindo que auth.uid() mapeia para um campo user_id ou via tabela de permissões

-- Tabela de permissões de usuário por empresa (se não existir ainda)
create table if not exists public.usuario_empresa (
  user_id     uuid not null references auth.users(id) on delete cascade,
  empresa_id  uuid not null references public.empresas_emitentes(id) on delete cascade,
  papel       varchar(20) not null default 'operador',
    -- 'admin' | 'fiscal' | 'operador' | 'leitura'
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),
  primary key (user_id, empresa_id)
);

alter table public.usuario_empresa enable row level security;

-- RLS: usuário vê apenas seus próprios vínculos
create policy "usuario_ve_proprios_vinculos"
  on public.usuario_empresa for select
  using (auth.uid() = user_id);

-- Helper function: retorna IDs das empresas do usuário atual
create or replace function public.get_empresas_do_usuario()
returns setof uuid language sql security definer as $$
  select empresa_id
  from public.usuario_empresa
  where user_id = auth.uid()
    and ativo = true;
$$;

-- =========================================================
-- POLÍTICAS RLS — NF-e
-- =========================================================
create policy "nfe_select_propria_empresa"
  on public.nfe_status for select
  using (empresa_id in (select public.get_empresas_do_usuario()));

create policy "nfe_insert_propria_empresa"
  on public.nfe_status for insert
  with check (empresa_id in (select public.get_empresas_do_usuario()));

create policy "nfe_update_propria_empresa"
  on public.nfe_status for update
  using (empresa_id in (select public.get_empresas_do_usuario()));

-- Edge Functions (service_role) têm bypass do RLS — não precisam de política

-- =========================================================
-- POLÍTICAS RLS — NF-e Itens (via NF-e pai)
-- =========================================================
create policy "nfe_itens_via_nfe"
  on public.nfe_itens for select
  using (
    nfe_id in (
      select id from public.nfe_status
      where empresa_id in (select public.get_empresas_do_usuario())
    )
  );

-- Aplica políticas similares para as demais tabelas
-- (padrão: usuário acessa apenas dados da empresa vinculada)

create policy "nfce_select_propria_empresa"
  on public.nfce_status for select
  using (empresa_id in (select public.get_empresas_do_usuario()));

create policy "nfse_select_propria_empresa"
  on public.nfse_status for select
  using (empresa_id in (select public.get_empresas_do_usuario()));

create policy "cte_select_propria_empresa"
  on public.cte_status for select
  using (empresa_id in (select public.get_empresas_do_usuario()));

create policy "xml_recebidos_select_propria_empresa"
  on public.xml_recebidos for select
  using (empresa_id in (select public.get_empresas_do_usuario()));

create policy "certificados_select_propria_empresa"
  on public.certificados_digitais for select
  using (empresa_id in (select public.get_empresas_do_usuario()));

-- Catálogos: todos os usuários autenticados podem ler
create policy "catalogo_ncm_public_read"
  on public.catalogo_ncm for select
  using (auth.role() = 'authenticated');

create policy "catalogo_cfop_public_read"
  on public.catalogo_cfop for select
  using (auth.role() = 'authenticated');

create policy "catalogo_cst_public_read"
  on public.catalogo_cst for select
  using (auth.role() = 'authenticated');

create policy "catalogo_municipios_public_read"
  on public.catalogo_municipios for select
  using (auth.role() = 'authenticated');
```

---

### 26. Triggers e Functions

```sql
-- Migration 0002 (cont.) — Funções e Triggers úteis

-- =========================================================
-- FUNÇÃO: Valida CNPJ (algoritmo mod11)
-- =========================================================
create or replace function public.validar_cnpj(cnpj text)
returns boolean language plpgsql immutable as $$
declare
  digits text;
  sum1   int := 0;
  sum2   int := 0;
  d13    int;
  d14    int;
  w1     int[] := array[5,4,3,2,9,8,7,6,5,4,3,2];
  w2     int[] := array[6,5,4,3,2,9,8,7,6,5,4,3,2];
begin
  digits := regexp_replace(cnpj, '[^0-9]', '', 'g');
  if length(digits) != 14 then return false; end if;
  if digits ~ '^(\d)\1{13}$' then return false; end if; -- 11111111111111

  for i in 1..12 loop
    sum1 := sum1 + (substring(digits, i, 1)::int * w1[i]);
  end loop;
  d13 := case when (sum1 % 11) < 2 then 0 else 11 - (sum1 % 11) end;
  if d13 != substring(digits, 13, 1)::int then return false; end if;

  for i in 1..13 loop
    sum2 := sum2 + (substring(digits, i, 1)::int * w2[i]);
  end loop;
  d14 := case when (sum2 % 11) < 2 then 0 else 11 - (sum2 % 11) end;
  return d14 = substring(digits, 14, 1)::int;
end;
$$;

-- Constraint de validação de CNPJ nas tabelas
alter table public.empresas_emitentes
  add constraint cnpj_valido check (public.validar_cnpj(cnpj));

-- =========================================================
-- FUNÇÃO: Alerta quando certificado vence em 30 dias
-- =========================================================
create or replace function public.verificar_certificados_vencendo()
returns table(empresa_id uuid, cnpj varchar, razao_social varchar, validade date, dias_restantes int)
language sql stable as $$
  select
    e.id,
    e.cnpj,
    e.razao_social,
    c.validade,
    (c.validade - current_date) as dias_restantes
  from public.certificados_digitais c
  join public.empresas_emitentes e on e.id = c.empresa_id
  where c.ativo = true
    and c.validade <= current_date + interval '30 days'
    and c.validade >= current_date
  order by c.validade;
$$;

-- =========================================================
-- FUNÇÃO: Resumo fiscal do mês
-- =========================================================
create or replace function public.resumo_fiscal_mes(
  p_empresa_id uuid,
  p_ano        int,
  p_mes        int
)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'nfe_emitidas',    count(*) filter (where status = 'autorizado'),
    'nfe_canceladas',  count(*) filter (where status = 'cancelado'),
    'nfe_rejeitadas',  count(*) filter (where status = 'erro_autorizacao'),
    'valor_total_emitido', coalesce(sum(valor_total) filter (where status = 'autorizado'), 0),
    'mes',             p_mes,
    'ano',             p_ano
  )
  from public.nfe_status
  where empresa_id = p_empresa_id
    and extract(year from data_emissao) = p_ano
    and extract(month from data_emissao) = p_mes;
$$;
```

---

### 27. Índices para Performance

```sql
-- Migration 0003_fiscal_indexes.sql

-- NF-e: consultas por chave (mais comum)
create index if not exists idx_nfe_chave on public.nfe_status(chave_nfe)
  where chave_nfe is not null;

-- NF-e: consultas por empresa + status (listagem de notas pendentes)
create index if not exists idx_nfe_empresa_status
  on public.nfe_status(empresa_id, status);

-- NF-e: consultas por data de emissão (relatórios mensais)
create index if not exists idx_nfe_data_emissao
  on public.nfe_status(empresa_id, data_emissao desc);

-- NF-e: busca por destinatário CNPJ
create index if not exists idx_nfe_cnpj_destinatario
  on public.nfe_status(cnpj_destinatario);

-- NF-e Itens: busca por NCM (relatórios de produtos)
create index if not exists idx_nfe_itens_ncm
  on public.nfe_itens(ncm);

-- XML Recebidos: notas não manifestadas
create index if not exists idx_xml_recebidos_pendentes
  on public.xml_recebidos(empresa_id, status_manifestacao)
  where status_manifestacao = 'pendente';

-- XML Recebidos: busca por emitente
create index if not exists idx_xml_recebidos_emitente
  on public.xml_recebidos(cnpj_emitente);

-- Certificados: alerta de vencimento
create index if not exists idx_certificados_validade
  on public.certificados_digitais(validade)
  where ativo = true;

-- NFC-e: busca por data (relatório de vendas)
create index if not exists idx_nfce_data_emissao
  on public.nfce_status(empresa_id, data_emissao desc);
```

---

## PARTE V — EDGE FUNCTIONS (CÓDIGO TYPESCRIPT PRONTO)

### 28. Estrutura de Pastas no Repo

```
supabase/functions/
├── _shared/
│   ├── focus-client.ts      ← Client Focus NFe (já documentado na seção 13)
│   ├── validators.ts        ← Validadores de CNPJ, CPF, CEP
│   ├── xml-parser.ts        ← Parser de XML de NF-e
│   └── supabase-admin.ts    ← Client Supabase com service_role
├── nfe-emitir/
│   └── index.ts
├── nfe-consultar/
│   └── index.ts
├── nfe-cancelar/
│   └── index.ts
├── nfe-carta-correcao/
│   └── index.ts
├── nfce-emitir/
│   └── index.ts
├── nfse-emitir/
│   └── index.ts
├── focus-webhook/
│   └── index.ts
└── xml-download/
    └── index.ts
```

---

### 29. Edge Function: nfe-emitir

```typescript
// supabase/functions/nfe-emitir/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FocusClient } from "../_shared/focus-client.ts";

interface NFeDadosInput {
  empresa_id: string;
  ref: string;
  dados_nfe: object; // JSON da NF-e conforme Focus NFe API
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let input: NFeDadosInput;
  try {
    input = await req.json() as NFeDadosInput;
  } catch {
    return new Response(
      JSON.stringify({ error: "JSON inválido no body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { empresa_id, ref, dados_nfe } = input;

  if (!empresa_id || !ref || !dados_nfe) {
    return new Response(
      JSON.stringify({ error: "empresa_id, ref e dados_nfe são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  // Busca empresa
  const { data: empresa, error: empresaErr } = await supabase
    .from("empresas_emitentes")
    .select("*")
    .eq("id", empresa_id)
    .eq("ativo", true)
    .single();

  if (empresaErr || !empresa) {
    return new Response(
      JSON.stringify({ error: "Empresa não encontrada ou inativa" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const token =
    empresa.ambiente === "producao"
      ? empresa.focus_token_producao
      : empresa.focus_token_homologacao;

  if (!token) {
    return new Response(
      JSON.stringify({ error: `Token Focus NFe não configurado para ${empresa.ambiente}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Verifica se a ref já existe (evita duplicidade)
  const { data: existente } = await supabase
    .from("nfe_status")
    .select("id, status, chave_nfe")
    .eq("empresa_id", empresa_id)
    .eq("ref", ref)
    .maybeSingle();

  if (existente && existente.status === "autorizado") {
    return new Response(
      JSON.stringify({
        error: "Referência já autorizada",
        chave_nfe: existente.chave_nfe,
        nfe_id: existente.id,
      }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  // Cria registro inicial no banco
  const { data: nfeRecord, error: insertErr } = await supabase
    .from("nfe_status")
    .upsert(
      {
        empresa_id,
        ref,
        status: "processando_autorizacao",
        ambiente: empresa.ambiente,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "empresa_id,ref" }
    )
    .select("id")
    .single();

  if (insertErr) {
    console.error("[nfe-emitir] Erro ao criar registro:", insertErr);
    return new Response(
      JSON.stringify({ error: "Erro ao registrar NF-e no banco" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Envia para a Focus NFe
  const client = new FocusClient(token, empresa.ambiente);
  let focusResult;
  try {
    focusResult = await client.emitirNFe(ref, dados_nfe);
  } catch (e) {
    console.error("[nfe-emitir] Erro ao chamar Focus NFe:", e);
    await supabase
      .from("nfe_status")
      .update({ status: "erro_autorizacao", mensagem_sefaz: String(e) })
      .eq("id", nfeRecord.id);
    return new Response(
      JSON.stringify({ error: "Erro na comunicação com Focus NFe", detalhe: String(e) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Atualiza banco com resposta
  await supabase
    .from("nfe_status")
    .update({
      status: focusResult.status ?? "processando_autorizacao",
      status_sefaz: focusResult.status_sefaz,
      mensagem_sefaz: focusResult.mensagem_sefaz,
      chave_nfe: focusResult.chave_nfe,
      numero: focusResult.numero,
      serie: focusResult.serie,
      protocolo: focusResult.protocolo,
      caminho_xml: focusResult.caminho_xml_nota_fiscal,
      caminho_danfe: focusResult.caminho_danfe,
      ultima_consulta: new Date().toISOString(),
    })
    .eq("id", nfeRecord.id);

  return new Response(
    JSON.stringify({
      nfe_id: nfeRecord.id,
      ref,
      status: focusResult.status,
      status_sefaz: focusResult.status_sefaz,
      mensagem_sefaz: focusResult.mensagem_sefaz,
      chave_nfe: focusResult.chave_nfe,
      numero: focusResult.numero,
      protocolo: focusResult.protocolo,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
```

---

### 30. Edge Function: nfe-consultar

```typescript
// supabase/functions/nfe-consultar/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FocusClient } from "../_shared/focus-client.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const ref = url.searchParams.get("ref");
  const empresa_id = url.searchParams.get("empresa_id");

  if (!ref || !empresa_id) {
    return new Response(
      JSON.stringify({ error: "ref e empresa_id são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: empresa } = await supabase
    .from("empresas_emitentes")
    .select("focus_token_homologacao, focus_token_producao, ambiente")
    .eq("id", empresa_id)
    .single();

  if (!empresa) {
    return new Response(
      JSON.stringify({ error: "Empresa não encontrada" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const token =
    empresa.ambiente === "producao"
      ? empresa.focus_token_producao
      : empresa.focus_token_homologacao;

  const client = new FocusClient(token, empresa.ambiente);
  const resultado = await client.consultarNFe(ref);

  // Atualiza status no banco
  await supabase
    .from("nfe_status")
    .update({
      status: resultado.status,
      status_sefaz: resultado.status_sefaz,
      mensagem_sefaz: resultado.mensagem_sefaz,
      chave_nfe: resultado.chave_nfe ?? undefined,
      numero: resultado.numero ?? undefined,
      serie: resultado.serie ?? undefined,
      protocolo: resultado.protocolo ?? undefined,
      caminho_xml: resultado.caminho_xml_nota_fiscal ?? undefined,
      caminho_danfe: resultado.caminho_danfe ?? undefined,
      ultima_consulta: new Date().toISOString(),
    })
    .eq("empresa_id", empresa_id)
    .eq("ref", ref);

  return new Response(JSON.stringify(resultado), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 31. Edge Function: nfe-cancelar

```typescript
// supabase/functions/nfe-cancelar/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FocusClient } from "../_shared/focus-client.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405 });
  }

  const { empresa_id, ref, justificativa } = await req.json();

  if (!empresa_id || !ref || !justificativa) {
    return new Response(
      JSON.stringify({ error: "empresa_id, ref e justificativa são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  if (justificativa.length < 15) {
    return new Response(
      JSON.stringify({ error: "Justificativa deve ter no mínimo 15 caracteres" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: nfe } = await supabase
    .from("nfe_status")
    .select("status, empresa_id")
    .eq("empresa_id", empresa_id)
    .eq("ref", ref)
    .single();

  if (!nfe) {
    return new Response(
      JSON.stringify({ error: "NF-e não encontrada" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (nfe.status !== "autorizado") {
    return new Response(
      JSON.stringify({ error: `NF-e não pode ser cancelada. Status atual: ${nfe.status}` }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const { data: empresa } = await supabase
    .from("empresas_emitentes")
    .select("focus_token_homologacao, focus_token_producao, ambiente")
    .eq("id", empresa_id)
    .single();

  const token =
    empresa!.ambiente === "producao"
      ? empresa!.focus_token_producao
      : empresa!.focus_token_homologacao;

  const client = new FocusClient(token, empresa!.ambiente);
  const resultado = await client.cancelarNFe(ref, justificativa);

  if (resultado.status === "cancelado") {
    await supabase
      .from("nfe_status")
      .update({ status: "cancelado" })
      .eq("empresa_id", empresa_id)
      .eq("ref", ref);

    // Registra evento de cancelamento
    await supabase.from("nfe_eventos").insert({
      nfe_id: (
        await supabase
          .from("nfe_status")
          .select("id")
          .eq("empresa_id", empresa_id)
          .eq("ref", ref)
          .single()
      ).data!.id,
      tipo_evento: "110111",
      descricao: "Cancelamento",
      justificativa,
      status: "autorizado",
      status_sefaz: resultado.status_sefaz,
      mensagem_sefaz: resultado.mensagem_sefaz,
      data_evento: new Date().toISOString(),
    });
  }

  return new Response(JSON.stringify(resultado), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 32. Edge Function: nfe-carta-correcao

```typescript
// supabase/functions/nfe-carta-correcao/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FocusClient } from "../_shared/focus-client.ts";

serve(async (req) => {
  const { empresa_id, ref, correcao } = await req.json();

  if (!empresa_id || !ref || !correcao) {
    return new Response(
      JSON.stringify({ error: "empresa_id, ref e correcao são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  if (correcao.length < 15) {
    return new Response(
      JSON.stringify({ error: "Correção deve ter no mínimo 15 caracteres" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Conta quantas CC-e já foram emitidas (máximo 20)
  const { data: nfe } = await supabase
    .from("nfe_status")
    .select("id")
    .eq("empresa_id", empresa_id)
    .eq("ref", ref)
    .single();

  if (!nfe) {
    return new Response(JSON.stringify({ error: "NF-e não encontrada" }), { status: 404 });
  }

  const { count: qtdCCe } = await supabase
    .from("nfe_eventos")
    .select("*", { count: "exact", head: true })
    .eq("nfe_id", nfe.id)
    .eq("tipo_evento", "110110");

  if ((qtdCCe ?? 0) >= 20) {
    return new Response(
      JSON.stringify({ error: "Limite de 20 Cartas de Correção por NF-e atingido" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const { data: empresa } = await supabase
    .from("empresas_emitentes")
    .select("focus_token_homologacao, focus_token_producao, ambiente")
    .eq("id", empresa_id)
    .single();

  const token =
    empresa!.ambiente === "producao"
      ? empresa!.focus_token_producao
      : empresa!.focus_token_homologacao;

  const client = new FocusClient(token, empresa!.ambiente);
  const resultado = await client.cartaCorrecao(ref, correcao);

  // Registra o evento CC-e
  await supabase.from("nfe_eventos").insert({
    nfe_id: nfe.id,
    tipo_evento: "110110",
    sequencia: (qtdCCe ?? 0) + 1,
    descricao: `CC-e ${(qtdCCe ?? 0) + 1}`,
    correcao,
    status: resultado.status ?? "enviado",
    status_sefaz: resultado.status_sefaz,
    mensagem_sefaz: resultado.mensagem_sefaz,
    data_evento: new Date().toISOString(),
  });

  return new Response(JSON.stringify(resultado), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 33. Edge Function: nfce-emitir (NFC-e Modelo 65)

> **ATENÇÃO:** Esta função só deve ser deployada na Fase 2. Não implante antes de ter o PDV físico e o cadastro de produtos atualizado.

```typescript
// supabase/functions/nfce-emitir/index.ts
// FASE 2 — Não implantar antes
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FocusClient } from "../_shared/focus-client.ts";

serve(async (req) => {
  const { empresa_id, ref, dados_nfce } = await req.json();

  if (!empresa_id || !ref || !dados_nfce) {
    return new Response(
      JSON.stringify({ error: "empresa_id, ref e dados_nfce são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: empresa } = await supabase
    .from("empresas_emitentes")
    .select("*")
    .eq("id", empresa_id)
    .eq("ativo", true)
    .single();

  if (!empresa) {
    return new Response(JSON.stringify({ error: "Empresa não encontrada" }), { status: 404 });
  }

  const token =
    empresa.ambiente === "producao"
      ? empresa.focus_token_producao
      : empresa.focus_token_homologacao;

  const client = new FocusClient(token, empresa.ambiente);

  // NFC-e é SÍNCRONA — resposta imediata
  let resultado;
  try {
    resultado = await client.emitirNFCe(ref, dados_nfce);
  } catch (e) {
    console.error("[nfce-emitir] Erro:", e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Persiste no banco
  await supabase.from("nfce_status").upsert(
    {
      empresa_id,
      ref,
      status: resultado.status ?? "erro_autorizacao",
      status_sefaz: resultado.status_sefaz,
      mensagem_sefaz: resultado.mensagem_sefaz,
      chave_nfe: resultado.chave_nfe,
      numero: resultado.numero,
      serie: resultado.serie,
      protocolo: resultado.protocolo,
      data_emissao: dados_nfce && (dados_nfce as any).data_emissao,
      url_qrcode: resultado.url_consulta_qrcode,
      caminho_xml: resultado.caminho_xml_nota_fiscal,
      caminho_danfe: resultado.caminho_danfe,
      ambiente: empresa.ambiente,
    },
    { onConflict: "empresa_id,ref" }
  );

  return new Response(JSON.stringify(resultado), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 34. Edge Function: nfse-emitir (NFS-e Goiânia)

> **ATENÇÃO:** Esta função entra na Fase 3 (maquinação AGB). Não implante antes.

```typescript
// supabase/functions/nfse-emitir/index.ts
// FASE 3 — Não implantar antes da maquinação AGB estar ativa
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FocusClient } from "../_shared/focus-client.ts";

serve(async (req) => {
  const { empresa_id, ref, dados_nfse } = await req.json();

  if (!empresa_id || !ref || !dados_nfse) {
    return new Response(
      JSON.stringify({ error: "empresa_id, ref e dados_nfse são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: empresa } = await supabase
    .from("empresas_emitentes")
    .select("*")
    .eq("id", empresa_id)
    .eq("ativo", true)
    .single();

  if (!empresa) {
    return new Response(JSON.stringify({ error: "Empresa não encontrada" }), { status: 404 });
  }

  // NFS-e requer inscrição municipal
  if (!empresa.inscricao_municipal) {
    return new Response(
      JSON.stringify({ error: "Inscrição municipal não cadastrada. Necessária para emitir NFS-e em Goiânia." }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const token =
    empresa.ambiente === "producao"
      ? empresa.focus_token_producao
      : empresa.focus_token_homologacao;

  const client = new FocusClient(token, empresa.ambiente);

  let resultado;
  try {
    resultado = await client.emitirNFSe(ref, dados_nfse);
  } catch (e) {
    console.error("[nfse-emitir] Erro:", e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Persiste no banco
  await supabase.from("nfse_status").upsert(
    {
      empresa_id,
      ref,
      status: resultado.status ?? "processando_autorizacao",
      status_sefaz: resultado.status_sefaz,
      mensagem_sefaz: resultado.mensagem_sefaz,
      numero_nfse: resultado.numero,
      data_emissao: (dados_nfse as any).data_emissao,
      valor_servicos: (dados_nfse as any).servico?.valor_servicos,
      cnpj_tomador: (dados_nfse as any).tomador?.cnpj,
      nome_tomador: (dados_nfse as any).tomador?.razao_social,
      discriminacao: (dados_nfse as any).servico?.discriminacao,
      ambiente: empresa.ambiente,
    },
    { onConflict: "empresa_id,ref" }
  );

  return new Response(JSON.stringify(resultado), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 35. Edge Function: focus-webhook (Recebe Callbacks da Focus)

```typescript
// supabase/functions/focus-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface FocusWebhookPayload {
  cnpj_emitente?: string;
  ref?: string;
  status?: string;
  status_sefaz?: string;
  mensagem_sefaz?: string;
  chave_nfe?: string;
  numero?: string;
  serie?: string;
  protocolo?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_danfe?: string;
  // Para NF-e recebida
  chave_nota?: string;
  cnpj_emitente_recebida?: string;
}

function validarTokenFocus(req: Request, tokenEsperado: string): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;
  const base64 = authHeader.split(" ")[1];
  const credentials = atob(base64);
  const [token] = credentials.split(":");
  return token === tokenEsperado;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Detecta o tipo de evento pelo path: /focus-webhook?event=nfe
  const url = new URL(req.url);
  const eventType = url.searchParams.get("event") ?? "nfe";

  let payload: FocusWebhookPayload;
  try {
    payload = await req.json() as FocusWebhookPayload;
  } catch {
    return new Response(null, { status: 400 });
  }

  // Busca empresa pelo CNPJ para validar o token
  if (payload.cnpj_emitente) {
    const { data: empresa } = await supabase
      .from("empresas_emitentes")
      .select("id, focus_token_producao, focus_token_homologacao, ambiente")
      .eq("cnpj", payload.cnpj_emitente)
      .single();

    if (empresa) {
      const tokenEsperado =
        empresa.ambiente === "producao"
          ? empresa.focus_token_producao
          : empresa.focus_token_homologacao;

      if (tokenEsperado && !validarTokenFocus(req, tokenEsperado)) {
        console.warn(`[focus-webhook] Token inválido para CNPJ ${payload.cnpj_emitente}`);
        return new Response(null, { status: 401 });
      }

      // Processa por tipo de evento
      if (eventType === "nfe" && payload.ref) {
        await supabase
          .from("nfe_status")
          .update({
            status: payload.status,
            status_sefaz: payload.status_sefaz,
            mensagem_sefaz: payload.mensagem_sefaz,
            chave_nfe: payload.chave_nfe,
            numero: payload.numero,
            serie: payload.serie,
            protocolo: payload.protocolo,
            caminho_xml: payload.caminho_xml_nota_fiscal,
            caminho_danfe: payload.caminho_danfe,
            ultima_consulta: new Date().toISOString(),
          })
          .eq("empresa_id", empresa.id)
          .eq("ref", payload.ref);

        console.log(`[focus-webhook] NF-e ${payload.ref} atualizada: ${payload.status}`);
      } else if (eventType === "nfce" && payload.ref) {
        await supabase
          .from("nfce_status")
          .update({
            status: payload.status,
            status_sefaz: payload.status_sefaz,
            mensagem_sefaz: payload.mensagem_sefaz,
            chave_nfe: payload.chave_nfe,
            numero: payload.numero,
            serie: payload.serie,
            protocolo: payload.protocolo,
            caminho_xml: payload.caminho_xml_nota_fiscal,
            caminho_danfe: payload.caminho_danfe,
          })
          .eq("empresa_id", empresa.id)
          .eq("ref", payload.ref);
      } else if (eventType === "nfe_recebida" && payload.chave_nfe) {
        // NF-e emitida por fornecedor com a Patrocínio como destinatária
        await supabase
          .from("xml_recebidos")
          .upsert(
            {
              empresa_id: empresa.id,
              chave_nfe: payload.chave_nfe,
              cnpj_emitente: payload.cnpj_emitente ?? "",
              status_manifestacao: "pendente",
            },
            { onConflict: "chave_nfe" }
          );

        console.log(`[focus-webhook] NF-e recebida: ${payload.chave_nfe}`);
      }
    }
  }

  // Responde 200 imediatamente (Focus exige < 2s)
  return new Response(JSON.stringify({ recebido: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 36. Edge Function: xml-download (Manifestação Automática)

```typescript
// supabase/functions/xml-download/index.ts
// Roda via cron a cada 15 minutos para baixar XMLs e manifestar notas recebidas

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Busca XMLs pendentes de manifestação
  const { data: pendentes } = await supabase
    .from("xml_recebidos")
    .select("id, empresa_id, chave_nfe")
    .eq("status_manifestacao", "pendente")
    .limit(50);

  if (!pendentes || pendentes.length === 0) {
    return new Response(JSON.stringify({ processados: 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  let processados = 0;

  for (const xml of pendentes) {
    // Busca token da empresa
    const { data: empresa } = await supabase
      .from("empresas_emitentes")
      .select("focus_token_producao, focus_token_homologacao, ambiente")
      .eq("id", xml.empresa_id)
      .single();

    if (!empresa) continue;

    const token =
      empresa.ambiente === "producao"
        ? empresa.focus_token_producao
        : empresa.focus_token_homologacao;

    const baseUrl =
      empresa.ambiente === "producao"
        ? "https://api.focusnfe.com.br"
        : "https://homologacao.focusnfe.com.br";

    // Emite Ciência da Operação (210210)
    try {
      const manifestRes = await fetch(`${baseUrl}/v2/manifestacao_destinatario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${token}:`),
        },
        body: JSON.stringify({
          chave_nfe: xml.chave_nfe,
          tipo: "210210",
        }),
      });

      if (manifestRes.ok || manifestRes.status === 422) {
        // 422 = já manifestado anteriormente
        await supabase
          .from("xml_recebidos")
          .update({
            status_manifestacao: "ciencia_enviada",
            data_manifestacao: new Date().toISOString(),
          })
          .eq("id", xml.id);

        processados++;
      }
    } catch (e) {
      console.error(`[xml-download] Erro ao manifestar ${xml.chave_nfe}:`, e);
    }
  }

  return new Response(JSON.stringify({ processados }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 37. Utilitários Compartilhados

#### validators.ts

```typescript
// supabase/functions/_shared/validators.ts

export function validarCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calc = (weights: number[]) =>
    weights.reduce((sum, w, i) => sum + parseInt(digits[i]) * w, 0);

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const r1 = calc(w1) % 11;
  const d1 = r1 < 2 ? 0 : 11 - r1;
  if (d1 !== parseInt(digits[12])) return false;

  const r2 = calc(w2) % 11;
  const d2 = r2 < 2 ? 0 : 11 - r2;
  return d2 === parseInt(digits[13]);
}

export function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcDigit = (len: number): number => {
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += parseInt(digits[i]) * (len + 1 - i);
    }
    const rem = (sum * 10) % 11;
    return rem === 10 ? 0 : rem;
  };

  return calcDigit(9) === parseInt(digits[9]) && calcDigit(10) === parseInt(digits[10]);
}

export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

export function limparCEP(cep: string): string {
  return cep.replace(/\D/g, "");
}

export function formatarCNPJ(cnpj: string): string {
  const d = limparCNPJ(cnpj);
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}
```

#### xml-parser.ts

```typescript
// supabase/functions/_shared/xml-parser.ts

export interface NFeDadosExtraidos {
  chaveAcesso: string;
  numeroNFe: string;
  serie: string;
  dataEmissao: string;
  cnpjEmitente: string;
  nomeEmitente: string;
  cnpjDestinatario?: string;
  cpfDestinatario?: string;
  nomeDestinatario: string;
  valorTotal: number;
  valorProdutos: number;
  naturezaOperacao: string;
  itens: Array<{
    numeroItem: number;
    codigo: string;
    descricao: string;
    ncm: string;
    cfop: string;
    unidade: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    icmsCST?: string;
  }>;
}

export function parsearNFeXML(xmlContent: string): NFeDadosExtraidos {
  // Parser simples usando regex — suficiente para campos fixos da NF-e 4.00
  // Para produção, considerar usar um parser XML completo
  const get = (tag: string): string => {
    const match = xmlContent.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
    return match?.[1]?.trim() ?? "";
  };

  // Extrai itens (múltiplos <det>)
  const detRegex = /<det nItem="(\d+)">([\s\S]*?)<\/det>/g;
  const itens: NFeDadosExtraidos["itens"] = [];
  let detMatch;

  while ((detMatch = detRegex.exec(xmlContent)) !== null) {
    const detContent = detMatch[2];
    const getFromDet = (tag: string): string => {
      const m = detContent.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
      return m?.[1]?.trim() ?? "";
    };

    itens.push({
      numeroItem: parseInt(detMatch[1]),
      codigo: getFromDet("cProd"),
      descricao: getFromDet("xProd"),
      ncm: getFromDet("NCM"),
      cfop: getFromDet("CFOP"),
      unidade: getFromDet("uCom"),
      quantidade: parseFloat(getFromDet("qCom") || "0"),
      valorUnitario: parseFloat(getFromDet("vUnCom") || "0"),
      valorTotal: parseFloat(getFromDet("vProd") || "0"),
      icmsCST: getFromDet("CST") || getFromDet("CSOSN"),
    });
  }

  return {
    chaveAcesso: get("chNFe"),
    numeroNFe: get("nNF"),
    serie: get("serie"),
    dataEmissao: get("dhEmi"),
    cnpjEmitente: get("CNPJ").substring(0, 14),
    nomeEmitente: get("xNome"),
    cnpjDestinatario: get("CNPJ").substring(14, 28) || undefined,
    nomeDestinatario: get("xNome").replace(get("xNome").substring(0, 14), "") || get("xNome"),
    valorTotal: parseFloat(get("vNF") || "0"),
    valorProdutos: parseFloat(get("vProd") || "0"),
    naturezaOperacao: get("natOp"),
    itens,
  };
}
```

---

### 38. Variáveis de Ambiente

#### .env.local (desenvolvimento — nunca commitar)

```bash
# === SUPABASE ===
SUPABASE_URL=https://XXXXXXXXXXXXXXXX.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === FOCUS NFe ===
FOCUS_TOKEN_HOMOLOGACAO=seu_token_de_homologacao
FOCUS_TOKEN_PRODUCAO=seu_token_de_producao
CNPJ_EMITENTE=00000000000000

# === IA/LLM ===
OPENAI_API_KEY=sk-proj-...

# === BANCO INTER ===
INTER_CLIENT_ID=...
INTER_CLIENT_SECRET=...

# === PLUGGY (Open Finance) ===
PLUGGY_CLIENT_ID=...
PLUGGY_CLIENT_SECRET=...
```

#### Supabase Secrets (para Edge Functions em produção)

```bash
# Configure via CLI ou Dashboard do Supabase
supabase secrets set FOCUS_TOKEN_PRODUCAO="seu_token"
supabase secrets set OPENAI_API_KEY="sk-proj-..."
supabase secrets set INTER_CLIENT_ID="..."
```

---

## PARTE VI — AUTOMAÇÃO COM IA (IMPACTO MÁXIMO)

### 39. OCR de Nota de Fornecedor → Lançamento Automático

#### Fluxo recomendado: XML-first

```
1. NF-e recebida? → Download automático do XML via Focus NFe (gratuito, 100% preciso)
2. Sem XML (nota de serviço, recibo, despesa pessoa física)? → GPT-4o Vision
```

**Nunca use OCR quando tiver o XML disponível.** XML é sempre mais confiável e mais barato.

#### Código completo — OCR com GPT-4o Vision

```typescript
// supabase/functions/ocr-nfe/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4";

interface OCRResult {
  numero: string;
  serie: string;
  dataEmissao: string;
  cnpjEmitente: string;
  nomeEmitente: string;
  valorTotal: number;
  chaveAcesso: string;
  itens: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    ncm?: string;
    cfop?: string;
  }>;
}

async function extrairDadosViaPDF(imagemBase64: string): Promise<OCRResult> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imagemBase64}`, detail: "high" },
          },
          {
            type: "text",
            text: `Extraia dados desta nota fiscal brasileira. Retorne APENAS JSON válido:
{
  "numero": "string",
  "serie": "string",
  "dataEmissao": "YYYY-MM-DD",
  "cnpjEmitente": "14 dígitos sem pontuação",
  "nomeEmitente": "string",
  "valorTotal": número,
  "chaveAcesso": "44 dígitos ou string vazia",
  "itens": [
    {
      "descricao": "string",
      "quantidade": número,
      "valorUnitario": número,
      "valorTotal": número,
      "ncm": "8 dígitos ou vazio",
      "cfop": "4 dígitos ou vazio"
    }
  ]
}`,
          },
        ],
      },
    ],
    max_tokens: 2048,
    temperature: 0,
  });

  return JSON.parse(response.choices[0].message.content ?? "{}") as OCRResult;
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { imagemBase64, empresaId, origemDocumento } = await req.json();

  if (!imagemBase64 || !empresaId) {
    return new Response(
      JSON.stringify({ error: "imagemBase64 e empresaId são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  let dados: OCRResult;
  try {
    dados = await extrairDadosViaPDF(imagemBase64);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Erro no OCR", detalhe: String(e) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Salva em xml_recebidos (como referência) ou diretamente em contas_pagar
  // O lançamento em contas_pagar está fora do escopo desta Edge Function fiscal
  // Ela retorna os dados para o frontend decidir onde lançar

  return new Response(
    JSON.stringify({ sucesso: true, dados, origem: origemDocumento ?? "ocr" }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

**Custo por nota:** ~US$ 0,002–0,005 (GPT-4o Vision, imagem simples). Para volume de 100 notas/mês: ~R$ 2–3/mês.

Fonte de preços: [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)

---

### 40. Manifestação Automática do Destinatário

| Evento | Código | Quando enviar |
|--------|--------|--------------|
| Ciência da Operação | `210210` | Imediatamente ao receber a NF-e (automático) |
| Confirmação da Operação | `210200` | Após confirmar fisicamente o recebimento da mercadoria |
| Desconhecimento | `210220` | Se não reconhecer a nota (possível fraude) |
| Operação Não Realizada | `210240` | Mercadoria devolvida / operação cancelada |

**Depois que você envia Confirmação da Operação (210200), o emitente não pode mais cancelar a nota.**

O cron de `xml-download` (seção 36) já envia a Ciência da Operação automaticamente. A Confirmação deve ser disparada pelo fluxo de recebimento físico (Fase 3).

---

### 41. Classificação Automática NCM/CFOP/CST via LLM

```typescript
// Utilitário reutilizável nas Edge Functions
async function classificarProduto(descricao: string): Promise<{
  ncm: string;
  cfopInterno: string;
  cfopInterestadual: string;
  cstICMS: string;
  confianca: number;
}> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Especialista em classificação fiscal brasileira (NCM, CFOP, CST).
Contexto: torrefação de café em Goiânia-GO. Produtos comuns: café torrado em grão (0901.21.00), café moído (0901.22.00), embalagens, sacas, insumos de produção.
Retorne APENAS JSON válido.`,
      },
      {
        role: "user",
        content: `Produto: "${descricao}". Classifique e retorne:
{
  "ncm": "formato XXXX.XX.XX",
  "cfopInterno": "5xxx",
  "cfopInterestadual": "6xxx",
  "cstICMS": "000",
  "confianca": 0-100
}`,
      },
    ],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content ?? "{}");
}
```

**BrasilAPI para validar NCM:**

```typescript
async function consultarNCM(codigo: string) {
  const res = await fetch(`https://brasilapi.com.br/api/ncm/v1/${codigo.replace(/\D/g, "")}`);
  if (!res.ok) throw new Error(`NCM ${codigo} não encontrado na BrasilAPI`);
  return res.json();
}
```

Fonte: [BrasilAPI — NCM](https://brasilapi.com.br)

---

### 42. Conciliação Bancária com IA (4 Camadas)

```
Camada 1 — Match exato:     valor + data + conta banco (100% confiança)
Camada 2 — Fuzzy match:     valor ± R$0,01 + data ± 1 dia (~99% confiança)
Camada 3 — Embeddings:      descrição extrato ~ histórico (não implementado na v1)
Camada 4 — LLM classifier:  GPT-4o-mini para casos ambíguos (>80% confiança = match)
```

```typescript
// Camada 1 e 2 — Match determinístico
function matchDeterministico(
  valor: number,
  data: string,
  lancamentos: Array<{ id: string; valor: number; data: string }>
): string | null {
  const normalize = (d: string) => new Date(d).toISOString().split("T")[0];

  // Camada 1: exato
  let match = lancamentos.find(
    (l) => Math.abs(l.valor - Math.abs(valor)) < 0.01 && normalize(l.data) === normalize(data)
  );
  if (match) return match.id;

  // Camada 2: fuzzy (±1 dia)
  match = lancamentos.find((l) => {
    const diffDias = Math.abs(
      (new Date(l.data).getTime() - new Date(data).getTime()) / 86400000
    );
    return Math.abs(l.valor - Math.abs(valor)) < 0.01 && diffDias <= 1;
  });
  return match?.id ?? null;
}

// Camada 4 — LLM para casos sem match
async function matchLLM(
  transacao: { descricao: string; valor: number; data: string },
  candidatos: Array<{ id: string; descricao: string; valor: number; data: string; fornecedor?: string }>
): Promise<{ id: string | null; confianca: number }> {
  if (candidatos.length === 0) return { id: null, confianca: 0 };

  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um sistema de conciliação bancária para torrefação de café. Identifique qual lançamento do ERP corresponde à transação bancária.",
      },
      {
        role: "user",
        content: `Transação: ${transacao.data} | R$ ${transacao.valor} | "${transacao.descricao}"

Candidatos: ${candidatos.map((c, i) => `${i + 1}. [${c.id}] ${c.data} | R$ ${c.valor} | "${c.descricao}" | ${c.fornecedor ?? "sem fornecedor"}`).join("\n")}

Retorne JSON: {"id": "uuid ou null", "confianca": 0-100}`,
      },
    ],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content ?? "{}");
}
```

---

### 43. Chatbot Fiscal Interno (Text-to-SQL sobre Supabase)

```typescript
// supabase/functions/chatbot-fiscal/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4";

const SCHEMA_CONTEXT = `
Tabelas disponíveis:
- nfe_status: id, empresa_id, ref, status, chave_nfe, numero, serie, data_emissao, valor_total, cnpj_destinatario, nome_destinatario
- nfe_itens: id, nfe_id, numero_item, descricao, ncm, cfop, quantidade, valor_bruto
- xml_recebidos: id, empresa_id, chave_nfe, cnpj_emitente, nome_emitente, data_emissao, valor_total, status_manifestacao
- nfse_status: id, empresa_id, numero_nfse, data_emissao, valor_servicos, cnpj_tomador, nome_tomador
- certificados_digitais: id, empresa_id, validade, ativo

Regras: apenas SELECT. Nunca UPDATE/DELETE/INSERT. empresa_id deve ser filtrado pelo parâmetro.
`;

serve(async (req) => {
  const { pergunta, empresa_id } = await req.json();

  if (!pergunta || !empresa_id) {
    return new Response(
      JSON.stringify({ error: "pergunta e empresa_id são obrigatórios" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  // Gera SQL a partir da pergunta
  const sqlResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Você converte perguntas em SQL PostgreSQL para o ERP da Patrocínio Café.
${SCHEMA_CONTEXT}
Sempre adicione WHERE empresa_id = '${empresa_id}' nas consultas.
Retorne APENAS o SQL, sem explicação.`,
      },
      { role: "user", content: pergunta },
    ],
    temperature: 0,
  });

  const sql = sqlResponse.choices[0].message.content?.trim() ?? "";

  // Valida que é apenas SELECT
  if (!/^select/i.test(sql)) {
    return new Response(
      JSON.stringify({ error: "Apenas consultas SELECT são permitidas" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Executa o SQL
  const { data, error } = await supabase.rpc("exec_sql_readonly", { query: sql });

  if (error) {
    console.error("[chatbot-fiscal] Erro SQL:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao executar consulta", sql }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Gera resposta em linguagem natural
  const respostaNatural = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você resume resultados de banco de dados em linguagem natural simples para o Gabriel, dono de torrefação de café. Seja direto.",
      },
      {
        role: "user",
        content: `Pergunta: "${pergunta}"\nDados: ${JSON.stringify(data)}`,
      },
    ],
    temperature: 0.2,
  });

  return new Response(
    JSON.stringify({
      resposta: respostaNatural.choices[0].message.content,
      sql,
      dados: data,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

### 44. Agente Autônomo de Fechamento Mensal

O agente executa automaticamente na virada do mês via `pg_cron`. Fluxo:

```
1. Busca todas as NF-e emitidas no mês
2. Verifica se há notas em status pendente (ainda processando)
3. Calcula ICMS, PIS/COFINS do mês
4. Verifica divergências básicas (valor total emitido vs. soma dos itens)
5. Gera relatório de fechamento em JSON
6. Salva no Storage do Supabase
7. Envia notificação para Gabriel (via e-mail ou Supabase Realtime)
```

O código completo do agente está na seção 16 da pesquisa de automação. A implementação completa usa OpenAI Assistants API com `tool_use` para chamar as funções do ERP.

**Cron no Supabase (pg_cron):**

```sql
-- Executa às 01:00 do dia 1 de cada mês
select cron.schedule(
  'fechamento-mensal',
  '0 1 1 * *',
  $$
    select net.http_post(
      url := 'https://SEU_PROJETO.supabase.co/functions/v1/agente-fechamento',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer SEU_SERVICE_ROLE_KEY"}'::jsonb,
      body := jsonb_build_object('mes', to_char(now() - interval '1 month', 'YYYY-MM'))
    );
  $$
);
```

Referência: [Supabase Cron Blog](https://supabase.com/blog/supabase-cron) · [Supabase — Schedule Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)

---

### 45. Detecção de Fraude (CNPJ Inidôneo, Duplicidade, Z-Score)

```typescript
// Verificação de CNPJ via BrasilAPI (gratuito)
async function verificarCNPJ(cnpj: string): Promise<{
  ativo: boolean;
  situacao: string;
  nomeFantasia: string;
  cnae: string;
}> {
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/\D/g, "")}`);
  if (!res.ok) throw new Error(`CNPJ ${cnpj} não encontrado`);
  const data = await res.json();
  return {
    ativo: data.descricao_situacao_cadastral === "ATIVA",
    situacao: data.descricao_situacao_cadastral,
    nomeFantasia: data.nome_fantasia || data.razao_social,
    cnae: data.cnae_fiscal,
  };
}

// Detecção de duplicidade de NF-e (mesma chave de acesso)
async function verificarDuplicidade(
  supabase: ReturnType<typeof createClient>,
  chaveNfe: string,
  empresaId: string
): Promise<boolean> {
  const { count } = await supabase
    .from("nfe_status")
    .select("*", { count: "exact", head: true })
    .eq("chave_nfe", chaveNfe)
    .eq("empresa_id", empresaId);
  return (count ?? 0) > 0;
}

// Z-score para detectar valores anômalos nas notas fiscais
function calcularZScore(valor: number, historico: number[]): number {
  if (historico.length < 2) return 0;
  const media = historico.reduce((a, b) => a + b, 0) / historico.length;
  const variancia = historico.reduce((sum, x) => sum + Math.pow(x - media, 2), 0) / historico.length;
  const desvio = Math.sqrt(variancia);
  return desvio === 0 ? 0 : Math.abs((valor - media) / desvio);
}
// Z-score > 3: alerta de anomalia de valor
```

Referência: [BrasilAPI CNPJ](https://brasilapi.com.br) · [Inidon — CNPJ Inidôneo](https://inidon.com.br/site/artigos/artigo.php?article=130)

---

### 46. Previsão de Fluxo de Caixa com IA

```typescript
// Previsão simplificada usando GPT-4o com histórico dos últimos 6 meses
async function preverFluxoCaixa(historico: Array<{
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}>): Promise<{
  previsao: Array<{ mes: string; receitas: number; despesas: number; saldo: number }>;
  insights: string;
}> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Você é o analista financeiro de uma torrefação de café (25.000 kg/mês, Goiânia-GO).
Analise o histórico e projete os próximos 3 meses.
Retorne JSON: {"previsao": [...3 meses], "insights": "texto curto"}`,
      },
      {
        role: "user",
        content: `Histórico dos últimos ${historico.length} meses: ${JSON.stringify(historico)}`,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content ?? "{}");
}
```

Para maior precisão com séries temporais, avaliar [Amazon Chronos](https://galileo.ai/blog/amazon-chronos-ai-time-series-forecasting-guide) quando o histórico atingir 24+ meses.

---

### 47. Dashboard Fiscal com Insights Gerados por IA

O dashboard deve exibir em tempo real (Supabase Realtime):
- NF-e emitidas hoje / semana / mês
- Valor total emitido × meta
- Status de notas (processando, autorizadas, com erro)
- Alertas ativos (certificado, obrigações, anomalias)
- Insights gerados por LLM (narrativa de 2-3 linhas)

```typescript
// Insight automático para o card do dashboard
async function gerarInsightDiario(dados: {
  nfeHoje: number;
  valorHoje: number;
  mediaUltimos7Dias: number;
}): Promise<string> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  const variacao = ((dados.valorHoje - dados.mediaUltimos7Dias) / dados.mediaUltimos7Dias * 100).toFixed(1);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Hoje: ${dados.nfeHoje} NF-e, R$ ${dados.valorHoje}. Média 7 dias: R$ ${dados.mediaUltimos7Dias}. Variação: ${variacao}%.
Escreva 1 frase de insight para o dashboard da torrefação. Direto, sem rodeios.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 80,
  });

  return response.choices[0].message.content ?? "";
}
```

---

### 48. Alertas Inteligentes (Certificado, Obrigação, Anomalia)

**Cron Supabase — alertas a cada 6 horas:**

```sql
-- Alerta de certificado vencendo em 30 dias
select cron.schedule(
  'alerta-certificado',
  '0 */6 * * *',
  $$
    select net.http_post(
      url := 'https://SEU_PROJETO.supabase.co/functions/v1/alertas-fiscais',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer SEU_KEY"}'::jsonb,
      body := '{"tipo": "certificado"}'::jsonb
    );
  $$
);
```

```typescript
// supabase/functions/alertas-fiscais/index.ts (fragmento)
// Verifica certificados vencendo em 30 dias
const { data: certificados } = await supabase
  .rpc("verificar_certificados_vencendo");

for (const cert of certificados ?? []) {
  if (!cert.alerta_enviado) {
    // Envia notificação (e-mail, Supabase Realtime, webhook)
    console.log(`ALERTA: Certificado da empresa ${cert.razao_social} vence em ${cert.dias_restantes} dias`);

    await supabase
      .from("certificados_digitais")
      .update({ alerta_enviado: true })
      .eq("empresa_id", cert.empresa_id);
  }
}
```

---

## PARTE VII — INTEGRAÇÕES BANCÁRIAS

### 49. Banco Inter — API Gratuita para Correntistas

O Inter é o banco mais integrado com ERPs brasileiros. A API é gratuita para correntistas PJ.

| Recurso | Endpoint | Autenticação |
|---------|----------|-------------|
| Extrato | `GET /banking/v2/extrato` | OAuth 2.0 + mTLS |
| Saldo | `GET /banking/v2/saldo` | OAuth 2.0 + mTLS |
| PIX Cobrança | `POST /pix/v2/cob` | OAuth 2.0 + mTLS |
| PIX Consultar | `GET /pix/v2/cob/{txid}` | OAuth 2.0 + mTLS |
| PIX Automático | Endpoints disponíveis desde julho/2025 | OAuth 2.0 + mTLS |

Documentação: [developers.inter.co](https://developers.inter.co)

**Observação mTLS:** A API do Inter requer certificado mTLS (certificado de cliente diferente do certificado fiscal A1). Gere pelo portal Inter Empresas.

```typescript
// Busca extrato do Inter (autenticação OAuth 2.0 + mTLS)
async function buscarExtratoInter(
  clientId: string,
  clientSecret: string,
  certPem: string,
  keyPem: string,
  dataInicio: string,
  dataFim: string
): Promise<object[]> {
  // Obter access token
  const tokenRes = await fetch("https://cdpj.partners.bancointer.com.br/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "extrato.read",
    }),
    // mTLS: passar cert + key no cliente HTTP
  });

  const { access_token } = await tokenRes.json();

  const extratoRes = await fetch(
    `https://cdpj.partners.bancointer.com.br/banking/v2/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const data = await extratoRes.json();
  return data.transacoes ?? [];
}
```

---

### 50. Open Finance via Pluggy

O Pluggy conecta múltiplos bancos via Open Finance com uma única API.

| Plano | Preço/mês | Melhor para |
|-------|-----------|------------|
| Dev (trial) | Grátis (14 dias) | Testar integração |
| Basic | R$ 2.500/mês | Primeiro projeto em produção |
| Growth | Sob consulta | Volume alto |

Fonte: [Pluggy Pricing](https://www.pluggy.ai/en/pricing)

**Alternativa mais barata:** Use apenas a API nativa do Banco Inter (gratuita para correntistas) para extrato em vez do Pluggy. Só use o Pluggy se a Patrocínio Café tiver conta em múltiplos bancos.

---

### 51. PIX Automático (Débito Automático via PIX)

Lançado em 16/06/2025, o PIX Automático substitui o débito automático tradicional. ([Agência Brasil — PIX Automático](https://agenciabrasil.ebc.com.br/economia/noticia/2025-06/bancos-passam-oferecer-pix-automatico-partir-desta-segunda))

**Para a Patrocínio Café (cobradora):**
- Exige CNPJ ativo há mais de 6 meses
- Clientes PF autorizam débito automático uma única vez
- Útil para assinaturas mensais de café (private label recorrente)
- Implementado via API do banco (Inter, por exemplo)

---

### 52. Conciliação Extrato OFX Automática

O formato OFX (Open Financial Exchange) é exportado pela maioria dos bancos.

```typescript
// Parser OFX simples para TypeScript
function parsearOFX(conteudo: string): Array<{
  data: string;
  valor: number;
  descricao: string;
  tipo: "debito" | "credito";
  id: string;
}> {
  const transacoes: Array<{data: string; valor: number; descricao: string; tipo: "debito" | "credito"; id: string}> = [];
  const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
  let match;

  while ((match = stmtTrnRegex.exec(conteudo)) !== null) {
    const bloco = match[1];
    const get = (tag: string) => bloco.match(new RegExp(`<${tag}>([^<\n]+)`))?.[1]?.trim() ?? "";

    const dtPosted = get("DTPOSTED");
    const ano = dtPosted.substring(0, 4);
    const mes = dtPosted.substring(4, 6);
    const dia = dtPosted.substring(6, 8);
    const valor = parseFloat(get("TRNAMT"));

    transacoes.push({
      data: `${ano}-${mes}-${dia}`,
      valor: Math.abs(valor),
      descricao: get("MEMO") || get("NAME"),
      tipo: valor >= 0 ? "credito" : "debito",
      id: get("FITID"),
    });
  }

  return transacoes;
}
```

---

### 53. Webhook de Confirmação PIX

```typescript
// Endpoint para receber confirmações de pagamento PIX (padrão BCB)
// Deploy como Edge Function em: /functions/v1/pix-webhook
serve(async (req) => {
  const payload = await req.json();

  if (!payload.pix || !Array.isArray(payload.pix)) {
    return new Response(null, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  for (const pix of payload.pix) {
    const { endToEnd
---

## PARTE VIII — FLUXOS E JORNADAS

### 54. Jornada "Venda de Café para Empresa" (B2B Atacado)

Fluxo completo: pedido → NF-e → boleto/PIX → recebimento → baixa automática.

**Gatilho de início:** Fase 1 completa (financeiro) + Fase 2 iniciada (emissão NF-e ativa).

#### Etapas do fluxo

```
1. [COMERCIAL] Pedido confirmado pelo cliente (email, WhatsApp ou ERP)
   └── Lançar pedido no ERP com: CNPJ, produto, quantidade, preço, prazo entrega

2. [ERP] Validações automáticas antes de emitir a NF-e
   ├── Consulta CNPJ na BrasilAPI → confirma razão social, situação ativa
   ├── Sugere NCM: 0901.21.00 (café torrado em grão) ou 0901.22.00 (moído)
   ├── Sugere CFOP: 5101 (intraestadual GO) ou 6101 (interestadual)
   └── Sugere CST ICMS: 102 (Simples Nacional sem crédito) ou 000 (regime normal)

3. [GABRIEL aprova] Revisa itens, preço, prazo, destinatário → confirma emissão

4. [EDGE FUNCTION: nfe-emitir] Envia JSON para Focus NFe API
   ├── Gera ref única: `nfe-{YYYYMMDD}-{pedido_id}`
   ├── POST /v2/nfe?ref=REF no ambiente correto (sandbox → produção)
   └── Salva status "processando_autorizacao" em nfe_status

5. [WEBHOOK: focus-webhook] Focus NFe notifica quando SEFAZ responde
   ├── status "autorizado" → atualiza nfe_status, armazena chave, número, protocolo
   ├── Dispara download automático do XML (xml-download)
   └── Cria conta a receber com vencimento conforme combinado

6. [EDGE FUNCTION: xml-download] Baixa XML + DANFE PDF da Focus NFe
   ├── Salva XML no Supabase Storage: /xmls/{cnpj}/{ano}/{mes}/{chave}-nfe.xml
   └── Salva DANFE em: /danfes/{cnpj}/{ano}/{mes}/{chave}.pdf

7. [COBRANÇA] Gera cobrança (boleto ou PIX Cobrança)
   ├── Via Asaas, Banco Inter ou Efí Bank
   └── Envia por email pro cliente junto com DANFE (PDF da NF-e)

8. [WEBHOOK BANCÁRIO] Confirmação de pagamento recebido
   ├── Atualiza conta a receber → status "pago"
   ├── Registra data real do recebimento
   └── Atualiza fluxo de caixa em tempo real

9. [MANIFESTAÇÃO DO DESTINATÁRIO] (automática — pelo cliente, não pela Patrocínio)
   ├── Evento 210210 (Ciência) → automático no sistema do cliente
   └── Evento 210200 (Confirmação) → após recebimento físico da mercadoria
```

#### Pontos de atenção fiscais

| Situação | Ação |
|----------|------|
| Cliente fora de GO (interestadual) | CFOP 6101 (produção própria) ou 6102 (adquirido de terceiros) |
| Frete por conta da Patrocínio | `modalidade_frete: "0"` + dados transportadora |
| Frete por conta do cliente | `modalidade_frete: "1"` — sem dados de transporte na NF-e |
| Cliente isento de IE | `indicador_inscricao_estadual_destinatario: "2"` |
| Exportação direta | CFOP 7101, `local_destino: "3"`, ICMS = 0 |
| Devolução parcial | NF-e de entrada (tipo_documento: 0) com CFOP 1201/2201 |

---

### 55. Jornada "Venda no Balcão" (NFC-e — Consumidor Final)

Fluxo: venda presencial → NFC-e → impressão QR Code → recebimento na hora.

**Quando usar:** Fase 2 (OP). A NFC-e não é prioridade na Fase 1.

#### Etapas

```
1. [PDV] Atendente seleciona produtos no ERP (interface simplificada)
   └── Sem necessidade de identificar o comprador (consumidor final anônimo)

2. [EDGE FUNCTION: nfce-emitir] Envia JSON para Focus NFe
   ├── POST /v2/nfce?ref=nfce-{timestamp}
   ├── Série da NFC-e: 001 (separada das NF-e modelo 55)
   └── Resposta é SÍNCRONA (diferente da NF-e que é assíncrona)

3. [PDV] Recebe resposta em ~2-3 segundos
   ├── status "autorizado" → imprime DANFE NFC-e (cupom com QR Code)
   └── QR Code contém link para consulta pública na SEFAZ-GO

4. [PAGAMENTO] Registra forma de pagamento
   ├── Dinheiro: forma_pagamento "01"
   ├── PIX: forma_pagamento "99" (outros) — gera QR Code PIX separado
   ├── Cartão débito: forma_pagamento "04"
   └── Cartão crédito: forma_pagamento "03"

5. [CONTINGÊNCIA] Se SEFAZ ou Focus estiver fora do ar:
   ├── Focus NFe ativa EPEC automaticamente
   ├── Imprime DANFE com "EMITIDA EM CONTINGÊNCIA"
   └── Focus transmite automaticamente quando SEFAZ voltar
```

#### Regras específicas NFC-e em Goiás

- Série: 001 a 499 para NFC-e (diferente do 890-999 mencionado na documentação genérica — verificar com SEFAZ-GO a faixa específica)
- CSC (Código de Segurança do Contribuinte): gerado na SEFAZ-GO, obrigatório para gerar QR Code
- Vinculação meio de pagamento: a partir de 01/05/2026 (IN SEFAZ-GO 1.608/2025) todo pagamento eletrônico deve estar vinculado à NFC-e
- Contingência: prazo de transmissão de até 24h após emissão offline ([SEFAZ-GO — IN 1.608/2025](https://appasp.economia.go.gov.br/Legislacao/arquivos/Secretario/IN/IN_1608_2025.htm))

---

### 56. Jornada "Torra Terceirizada para Marca X" (NFS-e — Serviço)

Fluxo: OS de serviço → torra executada → NFS-e → cobrança.

**Quando usar:** Fase 1 parcialmente (cobrança manual), Fase 2 (NFS-e automática).

#### Contexto fiscal crítico

A torra por encomenda (cliente envia o café cru, a Patrocínio torra e devolve) **pode incidir ICMS ou ISS** dependendo do destino do produto:

- **Cliente vai comercializar o café torrado:** ICMS sobre o valor agregado (decisão STF + [Parecer SEFAZ-GO 014/18](https://appasp.economia.go.gov.br/legislacao/arquivos/Superintendencia/SGAF/Parecer_Normativo/P_0014_2018.htm)). CFOP 5124 (saída) / 1901 (entrada do café cru para industrialização).
- **Serviço ao consumidor final** (ex.: torrar um lote para uso próprio): ISS 5% em Goiânia, NFS-e com subitem LC 116/2003 **14.05**.

Consulte o contador para cada contrato antes de emitir o primeiro documento.

#### Etapas (fluxo com NFS-e)

```
1. [OS] Abre Ordem de Serviço com dados do cliente (CNPJ, volume, tipo de torra)
2. [PRODUÇÃO] Executa a torra, registra peso entrada/saída, lote
3. [ERP] Gera NFS-e via EDGE FUNCTION: nfse-emitir
   ├── Dados do prestador: CNPJ Patrocínio + Inscrição Municipal
   ├── Serviço: subitem 14.05 + alíquota ISS 5% Goiânia
   └── Discriminação: "Serviços de industrialização por encomenda — Torra e beneficiamento de café arábica conforme OS n. XXXX"
4. [Focus NFe] Submete NFS-e para SGISS Goiânia (padrão ABRASF 2.04)
5. [WEBHOOK] Recebe confirmação → NFS-e autorizada
6. [COBRANÇA] Cria conta a receber com vencimento acordado
7. [RECEBIMENTO] Baixa automática via webhook de pagamento
```

---

### 57. Jornada "Compra de Café Cru do Produtor" (XML Recebido → Manifestação → Conta a Pagar)

**Quando usar:** Fase 3 (Compras Café Cru). Mas a manifestação do destinatário pode ser implementada já na Fase 1 para receber qualquer NF-e.

#### Etapas

```
1. [PRODUTOR/FORNECEDOR] Emite NF-e modelo 55 contra o CNPJ da Patrocínio
   └── CFOP: 1101 (compra pra industrialização, intraestadual) ou 2101 (interestadual)

2. [EDGE FUNCTION: xml-download / cron] A cada 15 minutos, consulta SEFAZ
   ├── Via Focus NFe: GET /v2/nfe_recebidas (NF-es emitidas contra o CNPJ)
   └── Ou via Arquivei / Espião NF-e (alternativas de monitoramento)

3. [AUTOMÁTICO] Para cada NF-e nova recebida:
   ├── Emite evento 210210 (Ciência da Operação) via Focus NFe
   ├── Download do XML completo
   ├── Parse do XML → extrai fornecedor, itens, valores, NCM, CFOP
   └── Cria rascunho de conta a pagar (status "pendente_conferencia")

4. [GABRIEL confere] Confere o rascunho vs. pedido de compra físico/WhatsApp
   ├── Aprovado → cria conta a pagar definitiva + manifesta evento 210200 (Confirmação)
   └── Divergência → retém para análise (não manifesta confirmação ainda)

5. [PAGAMENTO] Paga boleto/PIX do fornecedor na data de vencimento
   └── Webhook bancário baixa a conta a pagar automaticamente

6. [ARMAZENAMENTO] XML fica salvo no Supabase Storage por 5 anos (obrigação legal — [Portal NF-e SEFAZ](https://www.nfe.fazenda.gov.br))
```

#### NCMs de entrada (café cru)

| NCM | Produto | CFOP entrada |
|-----|---------|-------------|
| 0901.11.10 | Café cru em grão, não descafeinado | 1101 / 2101 |
| 0901.12.10 | Café cru descafeinado | 1101 / 2101 |
| 0901.11.20 | Café cru em grão, beneficiado | 1101 / 2101 |

---

### 58. Jornada "Fechamento Fiscal do Mês" (Agente Autônomo)

**Quando usar:** Fase 1, após o módulo financeiro estar estável.

#### Sequência de fechamento (dia 1 do mês seguinte)

```
1. [CRON: 00:00 do dia 1] Dispara agente-fechamento
   
2. [AGENTE] Etapa 1 — Coleta de dados
   ├── Busca todas as NF-e emitidas no mês (nfe_status WHERE data_emissao LIKE 'YYYY-MM%')
   ├── Busca todas as NF-e recebidas no mês (xml_recebidos WHERE data_emissao LIKE 'YYYY-MM%')
   ├── Busca todas as NFS-e emitidas (nfse_status WHERE data_emissao LIKE 'YYYY-MM%')
   └── Busca movimentações bancárias (contas_pagar + contas_receber WHERE data LIKE 'YYYY-MM%')

3. [AGENTE] Etapa 2 — Cálculo de impostos
   ├── ICMS: soma valor_icms de todas NF-e de saída do mês
   ├── PIS/COFINS: (regime Lucro Presumido) 0.65% + 3% sobre receita bruta
   ├── ISS: soma valor_iss de todas NFS-e emitidas
   └── Gera resumo: { icms, pis, cofins, iss, total_impostos }

4. [AGENTE] Etapa 3 — Conciliação
   ├── Compara total NF-e emitidas vs. receita lançada no ERP
   ├── Identifica NF-e sem baixa financeira correspondente
   └── Lista contas a receber em aberto vencidas

5. [AGENTE] Etapa 4 — Geração de relatório
   ├── DRE simplificado do mês (Receita - CMV - Despesas = Lucro)
   ├── Impostos a recolher com vencimentos
   ├── Top 5 clientes por volume de NF-e
   └── Alerta sobre obrigações acessórias do próximo mês

6. [AGENTE] Etapa 5 — Notificação
   ├── Salva relatório em Supabase Storage: /relatorios/{YYYY-MM}/fechamento.pdf
   └── Envia resumo por email/WhatsApp pra Gabriel

7. [GABRIEL] Revisa relatório + autoriza fechamento formal do mês
```

---

## PARTE IX — TESTES E HOMOLOGAÇÃO

### 59. Sandbox Focus NFe — Como Acessar, Limitações, CNPJs de Teste

#### URL base do sandbox

```
https://homologacao.focusnfe.com.br
```

#### Como configurar o ambiente de teste

1. Acesse [app-v2.focusnfe.com.br](https://app-v2.focusnfe.com.br/) e crie uma conta gratuita
2. Em "Minhas Empresas", cadastre a empresa com o **CNPJ real da Patrocínio Café**
3. O sistema fornece dois tokens: um de **homologação** e um de **produção**
4. Use o token de homologação + URL `https://homologacao.focusnfe.com.br` para testes
5. O token de produção + URL `https://api.focusnfe.com.br` somente após certificado e produção validados

#### Limitações do sandbox

| Limitação | Detalhe |
|-----------|---------|
| Certificado real obrigatório | Não há certificado "fake" — use o e-CNPJ A1 real |
| CNPJ habilitado | O CNPJ precisa estar cadastrado e ativo na SEFAZ estadual |
| Nome do destinatário | **Obrigatório** usar `"NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL"` |
| Processamento | Pode ser mais lento que produção (fila de homologação da SEFAZ) |
| XMLs sem valor fiscal | Todos os documentos emitidos em homologação não têm validade fiscal |

#### Por que o sandbox exige certificado real?

O ambiente de homologação da Focus NFe se conecta diretamente ao ambiente de homologação da **SEFAZ do estado**. A SEFAZ exige certificado digital válido mesmo para homologação — não existe "certificado fake" reconhecido pela infraestrutura ICP-Brasil.

Solução prática: use o e-CNPJ A1 da Patrocínio Café (mesmo certificado de produção) tanto no sandbox quanto em produção. A diferença está apenas na URL da API e no token usado.

---

### 60. Roteiro de Testes Obrigatórios (Checklist de 40 Itens antes de ir pra Produção)

Execute cada item no sandbox antes de habilitar a produção. Marque ✅ quando passar.

#### Bloco A — Autenticação e Configuração (5 itens)

```
[ ] A1. Token de homologação configurado no Supabase Secrets (FOCUS_NFE_TOKEN_SANDBOX)
[ ] A2. Token de produção configurado no Supabase Secrets (FOCUS_NFE_TOKEN_PROD)
[ ] A3. Certificado A1 (.pfx) importado no painel da Focus NFe (empresa emitente)
[ ] A4. CNPJ emitente cadastrado e ativo na SEFAZ-GO
[ ] A5. Variável NODE_ENV controlando qual token/URL usar (sandbox vs. produção)
```

#### Bloco B — NF-e Modelo 55 (10 itens)

```
[ ] B1. Emitir NF-e simples (1 item, venda interna GO→GO) → retorna status "autorizado"
[ ] B2. Consultar NF-e via ref → retorna chave_nfe, numero, serie, protocolo
[ ] B3. Emitir NF-e interestadual (GO→SP, CFOP 6101) → verificar ICMS interestadual
[ ] B4. Cancelar NF-e dentro de 24h → status "cancelado" + justificativa mínima 15 chars
[ ] B5. Emitir Carta de Correção → retorna confirmação + max 20 CC-e por nota
[ ] B6. Inutilizar numeração → série 1, nums 900-905 → status "inutilizado"
[ ] B7. Testar rejeição 590 (CST inválido para Simples) → capturar erro e exibir mensagem clara
[ ] B8. Testar rejeição 564 (valor produtos difere da soma dos itens) → validação client-side
[ ] B9. Webhook: configurar URL de teste → Focus envia payload ao autorizar
[ ] B10. Download XML após autorização → salvar em Supabase Storage, verificar integridade
```

#### Bloco C — NFC-e Modelo 65 (5 itens)

```
[ ] C1. Emitir NFC-e (consumidor anônimo, pagamento dinheiro) → autorização síncrona
[ ] C2. NFC-e com múltiplos itens e formas de pagamento mistas → valor total confere
[ ] C3. Cancelar NFC-e → retorna "cancelado"
[ ] C4. QR Code gerado → URL de consulta pública acessível no navegador
[ ] C5. Simular contingência EPEC → nota emitida em contingência, transmissão posterior
```

#### Bloco D — NFS-e Goiânia (5 itens)

```
[ ] D1. Emitir NFS-e (subitem 14.05, ISS 5%) → Focus submete para SGISS Goiânia
[ ] D2. Consultar status NFS-e → retorna número, data autorização
[ ] D3. Cancelar NFS-e → status "cancelado"
[ ] D4. NFS-e com tomador sem endereço → verificar se Goiânia exige endereço
[ ] D5. Teste com inscrição municipal correta da Patrocínio → sem rejeição 726
```

#### Bloco E — Webhooks (5 itens)

```
[ ] E1. Endpoint /functions/v1/focus-webhook recebe POST da Focus → retorna 200
[ ] E2. Validação do token no header Authorization do webhook
[ ] E3. NF-e "erro_autorizacao" → webhook captura e registra mensagem de erro
[ ] E4. NF-e "cancelado" → webhook atualiza nfe_status corretamente
[ ] E5. Webhook recebido → processamento assíncrono (< 2s de resposta ao Focus)
```

#### Bloco F — Banco de Dados e RLS (5 itens)

```
[ ] F1. Migration rodou sem erros no Supabase Dashboard
[ ] F2. RLS ativa: usuário comum não acessa dados de outro tenant
[ ] F3. Inserir NF-e na nfe_status → trigger gera numeração sequencial correta
[ ] F4. Query de NF-e por período (30 dias) retorna em < 500ms (índice funcionando)
[ ] F5. Backup automático do Supabase ativo (verificar no painel Supabase)
```

#### Bloco G — Integração Bancária (5 itens)

```
[ ] G1. API Banco Inter autenticada (OAuth2 + mTLS) → consulta saldo funciona
[ ] G2. Gerar PIX Cobrança via Inter → QR Code dinâmico retornado
[ ] G3. Webhook PIX confirmado → conta a receber baixada automaticamente
[ ] G4. Parse de extrato OFX → transações importadas corretamente
[ ] G5. Conciliação manual: 1 transação matcheada com 1 lançamento → status "conciliado"
```

---

### 61. Exemplos cURL Prontos para Testar no Postman/Insomnia

#### Autenticar e emitir NF-e simples

```bash
# Emitir NF-e de venda de café torrado (sandbox)
curl -u "SEU_TOKEN_HOMOLOGACAO:" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "natureza_operacao": "Venda de Mercadoria",
    "data_emissao": "2026-06-01T08:00:00-03:00",
    "data_entrada_saida": "2026-06-01T08:00:00-03:00",
    "tipo_documento": "1",
    "finalidade_emissao": "1",
    "consumidor_final": "0",
    "presenca_comprador": "9",
    "local_destino": "1",
    "regime_tributario_emitente": "1",
    "cnpj_emitente": "SEU_CNPJ_SEM_PONTOS",
    "nome_emitente": "PATRONCINIO CAFE LTDA",
    "logradouro_emitente": "Rua do Cafe",
    "numero_emitente": "100",
    "bairro_emitente": "Setor Industrial",
    "municipio_emitente": "Goiania",
    "uf_emitente": "GO",
    "cep_emitente": "74000000",
    "inscricao_estadual_emitente": "SUA_IE_GO",
    "cnpj_destinatario": "CNPJ_CLIENTE",
    "nome_destinatario": "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
    "logradouro_destinatario": "Av Principal",
    "numero_destinatario": "500",
    "bairro_destinatario": "Centro",
    "municipio_destinatario": "Goiania",
    "uf_destinatario": "GO",
    "cep_destinatario": "74000001",
    "indicador_inscricao_estadual_destinatario": "9",
    "modalidade_frete": "9",
    "valor_produtos": "500.00",
    "valor_total": "500.00",
    "icms_base_calculo": "0",
    "icms_valor_total": "0",
    "valor_pis": "0",
    "valor_cofins": "0",
    "formas_pagamento": [{"forma_pagamento": "15", "valor_pagamento": "500.00"}],
    "items": [{
      "numero_item": "1",
      "codigo_produto": "CAF-TOR-001",
      "descricao": "CAFE TORRADO EM GRAO ARABICA",
      "cfop": "5101",
      "codigo_ncm": "09012100",
      "unidade_comercial": "KG",
      "quantidade_comercial": "10.000",
      "valor_unitario_comercial": "50.00",
      "valor_bruto": "500.00",
      "unidade_tributavel": "KG",
      "quantidade_tributavel": "10.000",
      "valor_unitario_tributavel": "50.00",
      "inclui_no_total": "1",
      "icms_origem": "0",
      "icms_situacao_tributaria": "102",
      "pis_situacao_tributaria": "07",
      "cofins_situacao_tributaria": "07"
    }]
  }' \
  "https://homologacao.focusnfe.com.br/v2/nfe?ref=teste-$(date +%s)"
```

#### Consultar NF-e

```bash
curl -u "SEU_TOKEN_HOMOLOGACAO:" \
  "https://homologacao.focusnfe.com.br/v2/nfe/REFERENCIA_USADA_ACIMA"
```

#### Cancelar NF-e

```bash
curl -u "SEU_TOKEN_HOMOLOGACAO:" \
  -X DELETE \
  -H "Content-Type: application/json" \
  -d '{"justificativa": "Erro no pedido — produto incorreto informado"}' \
  "https://homologacao.focusnfe.com.br/v2/nfe/REFERENCIA_USADA_ACIMA"
```

#### Carta de Correção

```bash
curl -u "SEU_TOKEN_HOMOLOGACAO:" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"correcao": "Onde se le transportadora ABC, leia-se XYZ LTDA CNPJ 22222222000100"}' \
  "https://homologacao.focusnfe.com.br/v2/nfe/REFERENCIA/carta_correcao"
```

#### Emitir NFS-e em Goiânia

```bash
curl -u "SEU_TOKEN_HOMOLOGACAO:" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "data_emissao": "2026-06-01T10:00:00-0300",
    "natureza_operacao": 1,
    "optante_simples_nacional": true,
    "regime_especial_tributacao": 6,
    "prestador": {
      "cnpj": "SEU_CNPJ",
      "inscricao_municipal": "SUA_IM_GOIANIA",
      "codigo_municipio": 5208707
    },
    "tomador": {
      "cnpj": "CNPJ_CLIENTE",
      "razao_social": "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL"
    },
    "servico": {
      "discriminacao": "Servicos de torra por encomenda — cafe arabica 50kg — OS 2026-001",
      "valor_servicos": 400.00,
      "aliquota": 2.0,
      "item_lista_servico": "14.05",
      "codigo_tributario_municipio": "14.05",
      "codigo_cnae": "1031700",
      "iss_retido": false,
      "base_calculo": 400.00,
      "valor_iss": 8.00,
      "valor_liquido": 400.00
    }
  }' \
  "https://homologacao.focusnfe.com.br/v2/nfse?ref=nfse-teste-$(date +%s)"
```

---

### 62. Mocks e Fixtures para Testes Automatizados

```typescript
// __tests__/fixtures/nfe.fixture.ts
export const NFE_VENDA_CAFE_TORRADO_GO = {
  natureza_operacao: "Venda de Mercadoria",
  data_emissao: "2026-06-01T08:00:00-03:00",
  tipo_documento: "1",
  finalidade_emissao: "1",
  consumidor_final: "0",
  presenca_comprador: "9",
  local_destino: "1",
  regime_tributario_emitente: "1",
  cnpj_emitente: "12345678000195",
  nome_emitente: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
  logradouro_emitente: "Rua do Cafe",
  numero_emitente: "100",
  bairro_emitente: "Setor Industrial",
  municipio_emitente: "Goiania",
  uf_emitente: "GO",
  cep_emitente: "74000000",
  inscricao_estadual_emitente: "1234567890",
  cnpj_destinatario: "98765432000111",
  nome_destinatario: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
  indicador_inscricao_estadual_destinatario: "9",
  logradouro_destinatario: "Av Principal",
  numero_destinatario: "1",
  bairro_destinatario: "Centro",
  municipio_destinatario: "Goiania",
  uf_destinatario: "GO",
  cep_destinatario: "74000001",
  modalidade_frete: "9",
  valor_produtos: "500.00",
  valor_total: "500.00",
  icms_base_calculo: "0",
  icms_valor_total: "0",
  valor_pis: "0",
  valor_cofins: "0",
  formas_pagamento: [{ forma_pagamento: "15", valor_pagamento: "500.00" }],
  items: [
    {
      numero_item: "1",
      codigo_produto: "CAF-TOR-001",
      descricao: "CAFE TORRADO EM GRAO ARABICA — NF-E DE HOMOLOGACAO",
      cfop: "5101",
      codigo_ncm: "09012100",
      unidade_comercial: "KG",
      quantidade_comercial: "10.000",
      valor_unitario_comercial: "50.00",
      valor_bruto: "500.00",
      unidade_tributavel: "KG",
      quantidade_tributavel: "10.000",
      valor_unitario_tributavel: "50.00",
      inclui_no_total: "1",
      icms_origem: "0",
      icms_situacao_tributaria: "102",
      pis_situacao_tributaria: "07",
      cofins_situacao_tributaria: "07",
    },
  ],
};

// Mock da resposta da Focus NFe
export const FOCUS_RESPONSE_AUTORIZADO = {
  cnpj_emitente: "12345678000195",
  ref: "teste-ref-001",
  status: "autorizado",
  status_sefaz: "100",
  mensagem_sefaz: "Autorizado o uso da NF-e",
  chave_nfe: "52260612345678000195550010000001231234567890",
  numero: "123",
  serie: "1",
  protocolo: "152260000012345",
  caminho_xml_nota_fiscal: "/arquivos/12345678000195/202606/XMLs/52260612345678000195550010000001231234567890-nfe.xml",
  caminho_danfe: "/arquivos/12345678000195/202606/DANFEs/52260612345678000195550010000001231234567890.pdf",
};

export const FOCUS_RESPONSE_ERRO = {
  cnpj_emitente: "12345678000195",
  ref: "teste-ref-002",
  status: "erro_autorizacao",
  status_sefaz: "590",
  mensagem_sefaz: "Rejeição: CST inválido para contribuinte optante pelo Simples Nacional",
};

// Vitest mock da Edge Function
// __tests__/nfe-emitir.test.ts
import { describe, it, expect, vi } from "vitest";
import { NFE_VENDA_CAFE_TORRADO_GO, FOCUS_RESPONSE_AUTORIZADO } from "./fixtures/nfe.fixture";

vi.mock("../supabase/functions/_shared/focus-client", () => ({
  FocusNFeClient: vi.fn().mockImplementation(() => ({
    emitirNFe: vi.fn().mockResolvedValue(FOCUS_RESPONSE_AUTORIZADO),
    consultarNFe: vi.fn().mockResolvedValue(FOCUS_RESPONSE_AUTORIZADO),
  })),
}));

describe("nfe-emitir", () => {
  it("deve emitir NF-e e retornar status autorizado", async () => {
    const { FocusNFeClient } = await import("../supabase/functions/_shared/focus-client");
    const client = new FocusNFeClient({ token: "test", ambiente: "homologacao" });
    const resultado = await client.emitirNFe("ref-001", NFE_VENDA_CAFE_TORRADO_GO);
    expect(resultado.status).toBe("autorizado");
    expect(resultado.chave_nfe).toHaveLength(44);
  });
});
```

---

## PARTE X — PRODUÇÃO E OBSERVABILIDADE

### 63. Checklist Pré-Produção

Execute cada item antes de ativar a emissão real. Zero gambiarra.

#### Cadastro e habilitação

```
[ ] 1. CNPJ da Patrocínio Café ativo e regular na Receita Federal
[ ] 2. Inscrição Estadual ativa na SEFAZ-GO (verificar via SINTEGRA: https://www.sintegra.go.gov.br)
[ ] 3. Credenciamento para NF-e modelo 55 no SEFAZ-GO confirmado
[ ] 4. Credenciamento para NFC-e modelo 65 no SEFAZ-GO confirmado (quando aplicável)
[ ] 5. Inscrição Municipal ativa na Prefeitura de Goiânia (para NFS-e)
[ ] 6. Série de NF-e definida: série 1 para NF-e, série 001 para NFC-e
```

#### Certificado Digital

```
[ ] 7. e-CNPJ A1 (.pfx) válido emitido por AC credenciada (Certisign, Soluti, Valid)
[ ] 8. Certificado com validade mínima de 6 meses à frente (não usar certificado vencendo em breve)
[ ] 9. Certificado importado no painel Focus NFe (empresa emitente → editar → anexar certificado)
[ ] 10. Senha do certificado armazenada no Supabase Secrets (CERTIFICADO_A1_SENHA)
[ ] 11. Alerta de vencimento configurado (ver seção 66)
```

#### Focus NFe API

```
[ ] 12. Token de PRODUÇÃO obtido no painel Focus NFe (diferente do token de homologação)
[ ] 13. TOKEN guardado no Supabase Secrets: FOCUS_NFE_TOKEN_PROD
[ ] 14. Webhook de produção configurado: https://SEU_PROJETO.supabase.co/functions/v1/focus-webhook
[ ] 15. Plano Focus NFe adequado ao volume (Solo R$ 89,90 → 100 notas/mês; Growth se mais)
[ ] 16. URL base das Edge Functions configurada pra produção (não mais homologacao.focusnfe.com.br)
```

#### Supabase

```
[ ] 17. Projeto Supabase em ambiente de produção (não usar o projeto de desenvolvimento)
[ ] 18. Todos os Secrets configurados (FOCUS_NFE_TOKEN_PROD, OPENAI_API_KEY, INTER_CLIENT_ID, etc.)
[ ] 19. Backup automático habilitado (Supabase Dashboard → Settings → Backups)
[ ] 20. RLS ativada em todas as tabelas fiscais (verificar nfe_status, nfce_status, etc.)
[ ] 21. PITR (Point in Time Recovery) ativado no plano Pro do Supabase
```

#### Testes finais

```
[ ] 22. Todos os 40 itens do roteiro de testes (seção 60) passaram em sandbox
[ ] 23. Emitir 1 NF-e real de teste em produção (ex: R$ 1,00 para CNPJ próprio) → cancelar em seguida
[ ] 24. Confirmar que o XML da NF-e foi salvo no Supabase Storage
[ ] 25. Confirmar que o webhook de produção foi recebido e processado corretamente
```

---

### 64. Monitoramento (Supabase Logs, Sentry, Status Focus NFe)

#### Supabase Logs

```typescript
// Em qualquer Edge Function — padrão de log estruturado
console.log(JSON.stringify({
  level: "info",
  event: "nfe_emitida",
  ref: ref,
  cnpj: cnpjEmitente,
  status: resultado.status,
  timestamp: new Date().toISOString(),
}));

console.error(JSON.stringify({
  level: "error",
  event: "nfe_falhou",
  ref: ref,
  status_sefaz: erro.status_sefaz,
  mensagem: erro.mensagem_sefaz,
  timestamp: new Date().toISOString(),
}));
```

Para consultar os logs: Supabase Dashboard → Functions → Logs.

#### Status da Focus NFe

URL de monitoramento: [status.focusnfe.com.br](https://status.focusnfe.com.br)

Uptime histórico API Focus NFe: **99,97%** (dados até 2026). Se a Focus estiver fora, implementar fallback de contingência (ver seção 67).

#### Status da SEFAZ-GO

Consulta manual: [Portal NF-e SEFAZ Nacional](https://www.nfe.fazenda.gov.br/portal/) → Monitoramento → Situação dos Servidores.

#### Alerta de erros no banco

```sql
-- Consulta de NF-e com erro nas últimas 24h (rodar periodicamente ou via cron)
SELECT
  ref,
  status,
  status_sefaz,
  mensagem_sefaz,
  updated_at
FROM nfe_status
WHERE
  status = 'erro_autorizacao'
  AND updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

---

### 65. Rotina de Backup de XMLs (Obrigatório — 5 Anos)

A legislação federal exige guarda dos XMLs de NF-e por **5 anos** a partir da data de emissão ([Portal NF-e — art. 19 da Instrução Normativa RFB nº 2.005/2021](https://www.nfe.fazenda.gov.br)). O Supabase Storage é a solução adotada.

#### Estrutura de armazenamento

```
supabase-storage/
└── xmls/
    └── {cnpj}/
        └── {YYYY}/
            └── {MM}/
                ├── {chave_nfe}-nfe.xml
                ├── {chave_nfe}-nfe.xml.sig   (assinatura separada, se necessário)
                └── {chave_nfe}-canc.xml       (XML de cancelamento, se houver)
└── danfes/
    └── {cnpj}/
        └── {YYYY}/
            └── {MM}/
                └── {chave_nfe}.pdf
```

#### Edge Function de download e armazenamento

```typescript
// Trecho da função xml-download/index.ts
async function salvarXMLnoStorage(
  supabase: SupabaseClient,
  cnpj: string,
  chaveNFe: string,
  xmlConteudo: string,
  tipo: "nfe" | "canc" = "nfe"
): Promise<string> {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const path = `xmls/${cnpj}/${ano}/${mes}/${chaveNFe}-${tipo}.xml`;

  const { error } = await supabase.storage
    .from("documentos-fiscais")
    .upload(path, xmlConteudo, {
      contentType: "application/xml",
      upsert: false, // nunca sobrescreve — log de auditoria intocável
    });

  if (error) throw new Error(`Erro ao salvar XML: ${error.message}`);
  return path;
}
```

#### Política de retenção no Supabase Storage

Supabase Storage não tem política de expiração automática por padrão. Para garantir os 5 anos, **nunca configure lifecyle rules de deleção** no bucket `documentos-fiscais`. O bucket deve ser marcado como privado (acesso apenas via service_role).

#### Backup externo adicional (recomendado)

Configure um cron mensal que exporta todos os XMLs do mês para um serviço de armazenamento externo (ex.: Google Drive da empresa, Amazon S3 ou pasta local no servidor):

```typescript
// Cron mensal — exportar XMLs do mês anterior para backup externo
// supabase/functions/backup-xmls-mensal/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const mesAnterior = new Date();
  mesAnterior.setMonth(mesAnterior.getMonth() - 1);
  const ano = mesAnterior.getFullYear();
  const mes = String(mesAnterior.getMonth() + 1).padStart(2, "0");
  const cnpj = Deno.env.get("CNPJ_EMITENTE")!;
  const prefix = `xmls/${cnpj}/${ano}/${mes}/`;

  const { data: arquivos, error } = await supabase.storage
    .from("documentos-fiscais")
    .list(prefix);

  if (error) {
    console.error("Erro ao listar XMLs para backup:", error);
    return new Response(JSON.stringify({ erro: error.message }), { status: 500 });
  }

  // Aqui você pode enviar pra Google Drive, S3, etc.
  // Por ora, apenas loga o inventário mensal
  console.log(JSON.stringify({
    event: "backup_mensal_xmls",
    periodo: `${ano}-${mes}`,
    total_arquivos: arquivos?.length ?? 0,
    timestamp: new Date().toISOString(),
  }));

  return new Response(JSON.stringify({
    sucesso: true,
    periodo: `${ano}-${mes}`,
    total: arquivos?.length ?? 0,
  }), { headers: { "Content-Type": "application/json" } });
});
```

---

### 66. Alertas de Certificado A1 Vencendo (Cron no Supabase)

O certificado A1 vence geralmente em 12 meses. Se vencer sem renovação, **a emissão de NF-e para completamente**. O sistema deve alertar Gabriel com antecedência.

#### Tabela de controle de certificados

A tabela `certificados_digitais` (ver migration completa na seção 24) armazena `data_validade`. O cron abaixo verifica e alerta.

#### Cron de alerta — código completo

```typescript
// supabase/functions/alertas-certificado/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Busca certificados vencendo nos próximos 60 dias
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + 60);

  const { data: certificados, error } = await supabase
    .from("certificados_digitais")
    .select("id, cnpj_empresa, nome_arquivo, data_validade, ativo")
    .eq("ativo", true)
    .lte("data_validade", dataLimite.toISOString());

  if (error) {
    console.error("Erro ao buscar certificados:", error);
    return new Response(null, { status: 500 });
  }

  for (const cert of certificados ?? []) {
    const diasRestantes = Math.floor(
      (new Date(cert.data_validade).getTime() - Date.now()) / 86400000
    );

    // Salva alerta no banco
    await supabase.from("alertas_sistema").insert({
      tipo: "certificado_vencendo",
      titulo: `Certificado Digital vencendo em ${diasRestantes} dias`,
      mensagem: `O certificado e-CNPJ ${cert.cnpj_empresa} (${cert.nome_arquivo}) vence em ${new Date(cert.data_validade).toLocaleDateString("pt-BR")}. Renove com urgência para não interromper a emissão de NF-e.`,
      severidade: diasRestantes <= 7 ? "critico" : diasRestantes <= 30 ? "alto" : "medio",
      dados_extras: { cert_id: cert.id, dias_restantes: diasRestantes },
    });

    console.log(JSON.stringify({
      event: "alerta_certificado",
      cnpj: cert.cnpj_empresa,
      dias_restantes: diasRestantes,
      data_validade: cert.data_validade,
    }));
  }

  return new Response(JSON.stringify({
    sucesso: true,
    certificados_verificados: certificados?.length ?? 0,
  }), { headers: { "Content-Type": "application/json" } });
});
```

#### Configurar o cron no Supabase

```sql
-- Rodar diariamente às 8h (horário de Brasília = 11:00 UTC)
SELECT cron.schedule(
  'alerta-certificados-diario',
  '0 11 * * *',
  $$
    SELECT net.http_post(
      url := 'https://SEU_PROJETO.supabase.co/functions/v1/alertas-certificado',
      headers := '{"Authorization": "Bearer SEU_ANON_KEY"}'::jsonb
    );
  $$
);
```

---

### 67. Plano de Contingência (SEFAZ Fora do Ar, Focus Fora do Ar)

#### Cenário A — SEFAZ-GO temporariamente indisponível

1. A Focus NFe detecta automaticamente a indisponibilidade da SEFAZ.
2. Para **NF-e modelo 55:** Focus ativa contingência FS-DA (emissão local) ou EPEC (pré-registro na SEFAZ virtual). O contribuinte pode emitir o DANFE com o tipo de emissão de contingência impresso.
3. Para **NFC-e modelo 65:** Focus ativa EPEC automaticamente. O PDV imprime "EMITIDA EM CONTINGÊNCIA" no cupom.
4. Quando a SEFAZ retornar: Focus transmite automaticamente os documentos em contingência. O webhook `nfce_contingencia` informa a entrada e saída de contingência.
5. **Taxa de contingência saudável:** ≤ 0,5% das emissões mensais (ENCAT). Acima disso, a SEFAZ pode questionar.

#### Cenário B — Focus NFe temporariamente fora do ar

1. Verificar [status.focusnfe.com.br](https://status.focusnfe.com.br) — uptime histórico 99,97%.
2. Se confirmado incidente: aguardar (incidentes geralmente resolvidos em < 1h).
3. Se incidente prolongado (> 2h em horário comercial): contatar suporte@focusnfe.com.br.
4. **Medida paliativa:** Para NF-e urgente, emitir manualmente no portal da Focus NFe ([app-v2.focusnfe.com.br](https://app-v2.focusnfe.com.br/)) — interface web independente da API.
5. **Plano B de longo prazo:** Manter cadastro ativo em outra API (ex.: NFe.io ou PlugNotas) como fallback para emergências. Não migrar tudo — apenas ter o cadastro pronto.

#### Cenário C — Supabase Edge Functions fora do ar

1. Verificar [status.supabase.com](https://status.supabase.com).
2. Emissão manual via portal Focus NFe (app-v2.focusnfe.com.br).
3. Lançamentos manuais temporários no banco via Dashboard Supabase.
4. Quando Edge Functions retornarem: reprocessar fila de pendências.

#### Procedimento de emergência — script manual

```bash
# Emitir NF-e diretamente via cURL (sem Edge Function) em caso de emergência
# Usar apenas se o sistema interno estiver completamente fora
curl -u "TOKEN_PRODUCAO:" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @nfe_emergencia.json \
  "https://api.focusnfe.com.br/v2/nfe?ref=emergencia-$(date +%s)"
```

---

## PARTE XI — REFERÊNCIAS

### 68. Links Oficiais

| Recurso | URL |
|---------|-----|
| **Focus NFe — Documentação API v2** | [focusnfe.com.br/doc/](https://focusnfe.com.br/doc/) |
| **Focus NFe — Preços** | [focusnfe.com.br/precos/](https://focusnfe.com.br/precos/) |
| **Focus NFe — Status** | [status.focusnfe.com.br](https://status.focusnfe.com.br) |
| **Focus NFe — Fórum** | [forum.focusnfe.com.br](https://forum.focusnfe.com.br) |
| **Focus NFe — GitHub** | [github.com/FocusNFe](https://github.com/FocusNFe) |
| **Focus NFe — Guias** | [focusnfe.com.br/guides/](https://focusnfe.com.br/guides/) |
| **Portal Nacional NF-e** | [nfe.fazenda.gov.br/portal/](https://www.nfe.fazenda.gov.br/portal/) |
| **SEFAZ-GO** | [economia.go.gov.br](https://economia.go.gov.br) |
| **SEFAZ-GO — IN 1.608/2025** | [appasp.economia.go.gov.br](https://appasp.economia.go.gov.br/Legislacao/arquivos/Secretario/IN/IN_1608_2025.htm) |
| **SINTEGRA-GO** | [sintegra.go.gov.br](https://www.sintegra.go.gov.br) |
| **Consulta CNPJ (BrasilAPI)** | [brasilapi.com.br/api/cnpj/v1/{cnpj}](https://brasilapi.com.br) |
| **Consulta NCM (BrasilAPI)** | [brasilapi.com.br/api/ncm/v1/{codigo}](https://brasilapi.com.br) |
| **Portal da Reforma Tributária** | [reformatributaria.gov.br](https://www.reformatributaria.gov.br) |
| **EC 132/2023** | [planalto.gov.br/ccivil_03/constituicao/Emendas/Emc/emc132.htm](https://www.planalto.gov.br/ccivil_03/constituicao/Emendas/Emc/emc132.htm) |
| **LC 214/2025 (IBS/CBS/IS)** | [planalto.gov.br/ccivil_03/leis/lcp/Lcp214.htm](https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp214.htm) |
| **LC 116/2003 (ISS)** | [planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm) |
| **Receita Federal — TIPI** | [gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/tipi](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/tipi) |
| **CECAFÉ (Café na Cesta Básica)** | [cecafe.com.br/publicacoes](https://www.cecafe.com.br/publicacoes/noticias/tarifa-cafe-reforma-tributaria-20241219/) |
| **ISS Goiânia (SGISS)** | [issnetonline.com.br/goiania](https://www.issnetonline.com.br/goiania/online/login/login.aspx) |
| **Banco Inter — API Docs** | [developers.inter.co](https://developers.inter.co) |
| **Pluggy — Open Finance** | [pluggy.ai](https://www.pluggy.ai) |
| **Asaas — API Docs** | [docs.asaas.com](https://docs.asaas.com) |
| **Supabase — Docs** | [supabase.com/docs](https://supabase.com/docs) |
| **Supabase — Cron** | [supabase.com/blog/supabase-cron](https://supabase.com/blog/supabase-cron) |
| **OpenAI API Pricing** | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| **Cronograma Reforma Tributária** | [jettax.com.br/blog/tabela-cronograma-da-transicao-tributaria-2026-a-2033/](https://www.jettax.com.br/blog/tabela-cronograma-da-transicao-tributaria-2026-a-2033/) |
| **Split Payment 2026** | [checksped.com.br/artigos/split-payment-2026-impacto-fiscal/](https://checksped.com.br/artigos/split-payment-2026-impacto-fiscal/) |
| **CNAE 1081-3/02** | [dpobjetivo.com.br/tabelas/atribuicoes-do-cnae.html?cnae=1081302](https://dpobjetivo.com.br/tabelas/atribuicoes-do-cnae.html?cnae=1081302-torrefacao-e-moagem-de-cafe) |
| **Tabela ICMS 2025** | [focusnfe.com.br/blog/tabela-icms/](https://focusnfe.com.br/blog/tabela-icms/) |
| **Parecer SEFAZ-GO 014/18** | [appasp.economia.go.gov.br — ISS vs ICMS torra](https://appasp.economia.go.gov.br/legislacao/arquivos/Superintendencia/SGAF/Parecer_Normativo/P_0014_2018.htm) |
| **NT 2025.001** | [sysemp.com.br/nt-2025-001](https://www.sysemp.com.br/nt-2025-001-o-que-muda-na-nfc-e-e-nf-e-a-partir-de-setembro-de-2025/) |
| **Ajuste SINIEF 15/2025** | [netcpa.com.br — prazo 7 dias](https://netcpa.com.br/colunas/prazo-de-7-dias-para-correcao-de-erros-em-nf-e-entra-em-vigor-em-setembro/26099) |
| **PIX Automático** | [agenciabrasil.ebc.com.br](https://agenciabrasil.ebc.com.br/economia/noticia/2025-06/bancos-passam-oferecer-pix-automatico-partir-desta-segunda) |

---

### 69. Canais YouTube Recomendados

| Canal | URL | Por que seguir |
|-------|-----|---------------|
| **Focus NFe** | [youtube.com/@focusnfe](https://www.youtube.com/@focusnfe) | Canal oficial Focus NFe — webinars, tutoriais de integração, notas técnicas |
| **Qive** | YouTube | Auditoria fiscal, EFD ICMS/IPI, NCM, CBS/IBS — conteúdo técnico denso |
| **Contabilizei** | YouTube | Regime tributário, Simples, Lucro Presumido — linguagem acessível |
| **Jettax** | YouTube | Reforma Tributária CBS/IBS, cronograma 2026-2033, split payment |
| **Felipe Deschamps (Fique Rico / Filipe Deschamps)** | YouTube | TypeScript + Supabase — referência técnica em PT-BR |
| **Código Fonte TV** | YouTube | Node.js, TypeScript, APIs — contexto de desenvolvimento web brasileiro |

---

### 70. Comunidades (Discord, Slack, Fóruns)

| Comunidade | URL | Tema |
|------------|-----|------|
| **Fórum Focus NFe** | [forum.focusnfe.com.br](https://forum.focusnfe.com.br) | Integração Focus NFe, problemas técnicos, NF-e/NFC-e/NFS-e |
| **Supabase Discord** | [discord.supabase.com](https://discord.supabase.com) | Supabase, Edge Functions, PostgreSQL, RLS |
| **Dev Fiscais BR (Telegram)** | Buscar no Telegram | Desenvolvedores de sistemas fiscais brasileiros |
| **Contabilidade Digital BR (LinkedIn)** | LinkedIn Groups | Contadores digitais, automação contábil, reforma tributária |
| **Stack Overflow em Português** | [pt.stackoverflow.com](https://pt.stackoverflow.com) | Dúvidas técnicas gerais |

---

## 🤖 INSTRUÇÕES FINAIS PRO CURSOR

Este bloco é uma instrução direta ao Cursor. Leia com atenção antes de qualquer tarefa neste projeto.

---

### O que fazer SEMPRE antes de qualquer tarefa fiscal

1. **Leia a seção relevante deste arquivo.** Não é opcional. Se a tarefa envolve NF-e, leia a PARTE III. Se envolve banco de dados, leia a PARTE IV. Se envolve automação, leia a PARTE VI.

2. **Consulte o Roadmap (Seção 3 deste arquivo).** Confirme em qual fase o projeto está. Nunca implemente funcionalidade de fase futura sem autorização explícita do Gabriel.

3. **Verifique qual branch está ativa.** Faça `git pull` antes de qualquer mudança. Faça `git push` com mensagem descritiva ao terminar.

4. **Se a tarefa envolver fato externo** (alíquota atual, prazo SEFAZ, preço de API, regra de tributação): pesquise antes de afirmar. Não confie apenas na memória treinada — legislação fiscal muda. Consulte as fontes listadas na seção 68.

---

### Regras de comportamento com o Gabriel

**Gabriel não tem conhecimento técnico.** Ele é o dono da torrefadora, não um desenvolvedor. Isso significa:

- Quando precisar de aprovação para uma action destrutiva (DROP TABLE, DELETE em massa, alterar dados de produção): explique em linguagem simples o que vai acontecer, o que pode dar errado, e aguarde confirmação explícita. Nunca assuma "ele provavelmente quer isso".
- Quando Gabriel estiver pedindo algo tecnicamente errado (ex.: "cancela essa NF-e de 30 dias atrás"), não execute sem antes explicar: "Não dá pra cancelar uma NF-e com mais de 24h — mas você pode emitir uma NF-e de devolução ou CC-e. Qual faz mais sentido?" — Seja direto, sem condescendência.
- Quando Gabriel não souber descrever exatamente o que quer: faça perguntas específicas. "Você quer emitir NF-e ou NFC-e?", "O cliente é pessoa jurídica ou física?", "O transporte é por conta de quem?"
- Nunca use "prezado", "Olá Gabriel!" em excesso, "vamos lá" ou "excelente pergunta". Seja direto.
- Escreva toda comunicação com Gabriel em **português brasileiro informal** — como você falaria com um amigo que tem o próprio negócio.

---

### A Ordem Sagrada — nunca violar

```
FASE 1 — Financeiro Geral
  ✅ Contas a pagar e receber
  ✅ Fluxo de caixa
  ✅ DRE simplificado
  ✅ Conciliação bancária (banco Inter)
  ✅ Emissão NF-e modelo 55 (atacado B2B)
  ✅ Recebimento de NF-e de fornecedores + manifestação
  ❌ NFC-e (não na Fase 1)
  ❌ CT-e e MDF-e (não na Fase 1)
  ❌ n8n (não na Fase 1)

FASE 2 — Ordem de Produção
  ✅ OS (Ordem de Serviço) / OP (Ordem de Produção)
  ✅ NFC-e modelo 65 (balcão)
  ✅ NFS-e Goiânia (torra terceirizada)
  ❌ Compras Café Cru (não na Fase 2)

FASE 3 — Compras Café Cru + Logística + n8n
  ✅ Compras de café cru (produtor rural)
  ✅ CT-e (transporte MG→GO)
  ✅ MDF-e (manifesto de viagem)
  ✅ Manifestação do destinatário automatizada (Fase 3 completa)
  ✅ Integração n8n para automações externas
```

Se Gabriel pedir algo de uma fase futura, responda: "Isso faz parte da Fase [X]. Pra implementar agora, precisamos terminar [Y] da Fase atual primeiro. Você quer avançar a fase ou fazer de forma manual por enquanto?"

---

### Antes de rodar qualquer migration SQL

Checklist obrigatório:

1. Você testou o SQL no Supabase Dashboard (SQL Editor) do projeto de desenvolvimento?
2. O SQL tem `BEGIN;` e `ROLLBACK;` ao redor para teste seguro?
3. Se é uma migration destrutiva (DROP, ALTER COLUMN, DELETE sem WHERE): você comunicou ao Gabriel o que será perdido?
4. Você fez backup do estado atual (pelo menos um `SELECT COUNT(*)` nas tabelas afetadas)?
5. Você tem o script de reversão (ROLLBACK) pronto?

Se qualquer uma dessas respostas for "não": pare e resolva antes de continuar.

---

### Padrões de código obrigatórios neste projeto

#### TypeScript (Edge Functions Deno)

```typescript
// ✅ CORRETO — tipos explícitos, tratamento de erro, sem any
interface FocusNFePayload {
  natureza_operacao: string;
  cnpj_emitente: string;
  // ... campos tipados
}

async function emitirNFe(ref: string, payload: FocusNFePayload): Promise<FocusResponse> {
  try {
    const response = await fetch(`${BASE_URL}/v2/nfe?ref=${ref}`, {
      method: "POST",
      headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 422) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json() as FocusResponse;
  } catch (error) {
    console.error(JSON.stringify({ event: "nfe_emit_error", ref, error: String(error) }));
    throw error;
  }
}

// ❌ ERRADO — any, sem tratamento, sem tipos
async function emit(data: any) {
  const res = await fetch(url, { body: data });
  return res.json();
}
```

#### SQL (migrations Supabase)

```sql
-- ✅ CORRETO — transação, sem truncar, com rollback implícito
BEGIN;

ALTER TABLE nfe_status
  ADD COLUMN IF NOT EXISTS ibs_valor DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cbs_valor DECIMAL(15,2) DEFAULT 0;

COMMENT ON COLUMN nfe_status.ibs_valor IS 'Valor IBS destacado na NF-e (Reforma Tributária 2026+)';
COMMENT ON COLUMN nfe_status.cbs_valor IS 'Valor CBS destacado na NF-e (Reforma Tributária 2026+)';

COMMIT;

-- ❌ ERRADO — sem transação, sem validação
ALTER TABLE nfe_status ADD COLUMN ibs_valor DECIMAL;
```

---

### Configuração recomendada do `.cursorrules`

Salve este conteúdo em `.cursorrules` na raiz do repositório:

```
# Projeto: ERP Sistema-Financeiro-Geral — Patrocínio Café
# Dono: Gabriel (Judson Gabriell Martins)

## Referência fiscal obrigatória
Sempre leia o arquivo `/cerebro-fiscal.md` antes de qualquer tarefa fiscal, tributária ou de integração bancária.
Este arquivo contém:
- Roadmap de fases (não pule fases)
- Schema completo do banco de dados
- Código TypeScript pronto para Edge Functions
- Regras fiscais específicas para torrefação de café em Goiânia-GO
- Referências a legislação vigente com URLs

## Regras críticas
- Nunca DROP ou DELETE sem confirmação explícita do Gabriel
- Nunca implemente funcionalidade de fase futura sem autorização
- Nunca afirme fato externo (alíquota, regra, prazo) sem pesquisar
- Sempre use TypeScript tipado — nunca `any` em interfaces fiscais
- Sempre faça git pull antes de começar e git push ao terminar
- Comunique com Gabriel em português brasileiro informal

## Stack
- React + TypeScript + Vite + Tailwind + shadcn/ui (frontend)
- Supabase PostgreSQL + Edge Functions Deno (backend)
- Focus NFe API v2 (emissão fiscal)
- Banco Inter API (banking)
- OpenAI API GPT-4o (automação com IA)

## Fase atual
FASE 1 — Financeiro Geral
Próxima: Fase 2 — Ordem de Produção + NFC-e
```

---

### Atualizações deste arquivo

Este arquivo deve ser atualizado quando:

1. Uma nova fase for iniciada (atualizar Roadmap + metadados)
2. A legislação fiscal mudar (nova nota técnica SEFAZ, nova alíquota, novo prazo)
3. A Focus NFe lançar nova versão da API com mudança de endpoint
4. O stack do projeto mudar
5. Uma nova integração bancária ou de IA for adicionada

**Quem atualiza:** o Cursor atualiza quando o Gabriel pedir, ou quando identificar que uma informação do arquivo está desatualizada. Nunca atualizar silenciosamente — comunicar ao Gabriel o que foi alterado e por quê.

**Versão atual:** 1.0.0 | **Próxima revisão sugerida:** Janeiro 2027 (revisão do cronograma da Reforma Tributária e preços Focus NFe)

---

*Fim do CÉREBRO FISCAL — Patrocínio Café · v1.0.0 · Junho 2026*
*Stack: React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase + Focus NFe API v2*
*Referências: [focusnfe.com.br/doc/](https://focusnfe.com.br/doc/) · [nfe.fazenda.gov.br](https://www.nfe.fazenda.gov.br) · [planalto.gov.br](https://www.planalto.gov.br) · [economia.go.gov.br](https://economia.go.gov.br)*
