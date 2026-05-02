# 🗺️ ROADMAP DAS 49 → 56 ETAPAS — ERP Patrocínio Café (V2 com Superpoderes 2026)

> **Cursor:** este é o MAPA COMPLETO. Antes de executar qualquer etapa, lê a etapa + dependências.
> **V2 — Atualizado em 30/04/2026** com pesquisa Ultra Link Profunda Master sobre superpoderes 2026 (Cursor Cloud Agents, Bugbot Autofix, MCP, n8n WhatsApp + áudio).

---

## Como usar este arquivo

- Esse é o **Notepad de longo prazo**. Não carrega em toda conversa — só quando alguém menciona `@ROADMAP-49-ETAPAS` no prompt.
- Serve pra **enxergar o todo antes de codar**.
- **Toda etapa nova ou alterada na V2 está marcada com 🆕 ou ✏️.**

---

## Visão geral V2

| Fase | Módulo | Etapas | Status |
|---|---|---|---|
| 0 | Arquitetura + Superpoderes IA | 7 (4+3🆕) | 🔴 Não iniciada |
| 1 | Blindagem (Segurança) | 10 | 🟢 Core concluido (1.1-1.5, 1.9, 1.10) |
| 2 | Financeiro | 9 | 🔴 Pendente |
| 3 | Estoque / Produção | 6 | 🔴 Pendente |
| 4 | Fiscal | 4 | 🔴 Pendente |
| 5 | IA + n8n + WhatsApp | 11 (8+3🆕) | 🔴 Pendente |
| 6 | BI (Relatórios) | 4 | 🔴 Pendente |
| 7 | Mobile + Roles | 4 | 🔴 Pendente |
| | **TOTAL** | **55** | **7 concluidas (blindagem core)** |

> Antes era 49. Agora é 55. **+6 etapas** vindas da pesquisa Ultra Link 2026: Bugbot, MCP, Cursor Automations, bot WhatsApp por áudio, cobrança PIX automática, Cloud Agents.

---

# 🏗️ FASE 0 — ARQUITETURA + SUPERPODERES IA (7 etapas)

## 0.1 — ADRs (Architecture Decision Records)
- **O que faz:** Criar `docs/adr/` documentando decisões (stack, deploy, auth, RLS, banco, hosting).
- **Por que:** Daqui 6 meses ninguém lembra por que escolheu X. ADR preserva memória.
- **Risco se pular:** Médio.

## 0.2 — `.env` refinado + validação Zod + rotação de chaves
- **O que faz:** `.env.example` completo, `server/config/env.ts` valida env no boot com Zod.
- **Por que:** Typo em variável quebra produção em silêncio. Chave exposta = banco roubado.
- **Risco se pular:** Alto.

## 0.3 — Logger Pino + Request-Id
- **O que faz:** `pino` estruturado + `request-id` em cada request.
- **Por que:** Debug em produção sem log estruturado é caça ao tesouro.
- **Risco se pular:** Médio.

## 0.4 — Multi-tenant preparado (`empresas` + `user_empresas`)
- **O que faz:** Tabelas `empresas` e `user_empresas`. Coluna `empresa_id` em todas as tabelas de negócio.
- **Por que:** Hoje 1 user = 1 empresa. Futuro: contador, sócio, vender pra outra torrefação.
- **Risco se pular:** Altíssimo.

## 🆕 0.5 — Cursor Bugbot + Autofix ligado no repo
- **O que faz:** Habilitar Bugbot no `gabriellnovak2-max/Sistema-Financeiro-Geral`. Configurar pra revisar TODO PR automático + Autofix corrigindo bugs em commit separado antes do Gabriel ver.
- **Por que:** A IA do Cursor lê o código, acha bugs antes de virar problema, corrige sozinha em VM isolada. Hoje **76% dos bugs encontrados são resolvidos automaticamente** ([WorkOS](https://workos.com/blog/cursor-bugbot-autoreview-claude-code-prs)). **35% dos fixes do Autofix são merged direto pelos devs**.
- **Exemplo dia-a-dia:** É igual revisor de prova ortográfica antes de mandar redação pro professor — só que esse revisor também risca e escreve certo sozinho. Você vê o trabalho já meio pronto.
- **Como ligar:** [cursor.com/dashboard](https://cursor.com/dashboard) → aba Bugbot → conectar GitHub → escolher repo → Autofix mode "Create New Branch". Custo: ~US$ 40/mês ou usa créditos do plano PRO já contratado.
- **Arquivo afetado:** Criar `.cursor/BUGBOT.md` (regras de revisão do projeto).
- **Risco se pular:** Médio — perde rede de proteção. Cursor + Claude Code fazem PRs sem revisor cruzado.
- **Depende de:** Nada — pode ligar HOJE.
- **Fonte:** [WorkOS — Bugbot Autoreview](https://workos.com/blog/cursor-bugbot-autoreview-claude-code-prs), [Cursor — Bugbot Autofix](https://cursor.com/blog/bugbot-autofix).

## 🆕 0.6 — MCP Servers conectados ao Cursor (Supabase + GitHub + Vercel)
- **O que faz:** Configurar **Model Context Protocol** no Cursor pra ele falar direto com Supabase (banco), GitHub (repo) e Vercel (deploys) **sem o Gabriel ter que copiar comandos**.
- **Por que:** Hoje Gabriel cola SQL no Supabase manualmente. Com MCP, Cursor lê o schema do banco em tempo real, gera migration, abre PR e te avisa. Mesmo pra Vercel (status do deploy) e GitHub (issues, PRs).
- **Exemplo dia-a-dia:** É igual o caixa do mercado ter leitor de código de barras. Antes lia preço na etiqueta e digitava — agora bipa e o sistema sabe. MCP é o "bipe" do Cursor com Supabase/GitHub/Vercel.
- **Como ligar:**
  1. Supabase: Cursor → Settings → MCP → adicionar `https://mcp.supabase.com/mcp` (OAuth) — modo `read_only=true` em prod ([Supabase Docs](https://supabase.com/docs/guides/getting-started/mcp))
  2. GitHub: já temos `github_mcp_direct` configurado
  3. Vercel: já temos conector ativo
- **Arquivo afetado:** `.cursor/mcp.json` (novo).
- **Risco se pular:** Baixo — sistema funciona, mas Cursor anda às cegas em relação ao banco.
- **Depende de:** 0.5 (já ter Bugbot conhecendo o repo).
- **Fonte:** [Supabase MCP Server](https://supabase.com/blog/mcp-server), [DesignRevision Guide](https://designrevision.com/blog/supabase-mcp-server).

## 🆕 0.7 — `.cursor/BUGBOT.md` com regras do projeto
- **O que faz:** Criar arquivo `.cursor/BUGBOT.md` no root do repo com regras específicas de revisão pra Patrocínio Café:
  - Bloquear `eval()` e `exec()` (segurança)
  - Exigir teste em qualquer mudança no backend
  - Exigir validação Zod em rotas POST/PATCH
  - Bloquear SQL direto sem RLS
  - Avisar se mexer em `server/middleware/requireAuth.ts` sem testar
- **Por que:** Bugbot vira **revisor especializado em ERP de torrefação**, não revisor genérico. Daí ele cobra exatamente o que importa pro nosso projeto.
- **Exemplo dia-a-dia:** É igual fiscal da ANVISA na fábrica — não é polícia geral, é fiscal especialista que sabe exatamente o que olhar (validade, lote, rastreabilidade). Bugbot vira fiscal especialista.
- **Arquivo afetado:** `.cursor/BUGBOT.md` (novo) + nested `backend/.cursor/BUGBOT.md` se quiser regra mais fina.
- **Risco se pular:** Baixo — Bugbot funciona genérico, só não pega regra de negócio nossa.
- **Depende de:** 0.5.

---

# 🛡️ FASE 1 — BLINDAGEM (10 etapas) — CORE CONCLUIDO

## 1.1 — Middleware JWT ES256 no backend ✅ CONCLUIDA
- **O que faz:** `server/middleware/requireAuth.ts` usando `jose` + JWKS Supabase. Aplicar em `/api/*` exceto `/api/health`.
- **Risco se pular:** CRÍTICO — sistema invadível.

## 1.2 — Frontend manda Bearer token ✅ CONCLUIDA
- **O que faz:** `src/lib/apiClient.ts` injeta `Authorization: Bearer <token>` em todo fetch.
- **Depende de:** 1.1.

## 1.3 — Validação Zod em PATCH/POST ✅ CONCLUIDA
- **O que faz:** Schemas Zod por rota. Middleware `validate(schema)`.
- **Risco se pular:** Alto.

## 1.4 — Aposentar `server/db.ts` antigo ✅ CONCLUIDA
- **O que faz:** Remover conexão direta `pg`. Tudo via `@supabase/supabase-js`.
- **Depende de:** 1.3.

## 1.5 — `PUBLISHABLE_KEY` + JWT do usuario no frontend ✅ CONCLUIDA
- **O que faz:** Trocar `SUPABASE_ANON_KEY` por `sb_publishable_*` (2025).
- **Depende de:** 1.1, 1.2.

## 1.6 — Persistir Produtos no Supabase ⏸️ ADIADA
- **Depende de:** 1.5.

## 1.7 — Persistir Metas no Supabase ⏸️ ADIADA
- **Depende de:** 1.5.

## 1.8 — Persistir Configuracoes no Supabase ⏸️ ADIADA
- **Depende de:** 1.5.

## 1.9 — Migration coluna `data` text -> date ✅ CONCLUIDA (schema + runtime)
- **⚠️ ATENÇÃO:** Migration irreversível. Backup obrigatório antes.
- **Depende de:** 1.6-1.8.

## 1.10 — RLS refinado + indices ✅ CONCLUIDA
- **O que faz:** Policies por `empresa_id` + índices em `empresa_id`, `created_at`, `user_id`.
- **Risco se pular:** CRÍTICO.
- **Depende de:** 0.4 + 1.1-1.9.
- **Status atual:** blindagem core fechada e validada em producao.
- **Nota:** Etapas 1.6, 1.7 e 1.8 foram adiadas por dependencia de modelagem/tabelas e entram no planejamento da Fase 2.

---

# 💰 FASE 2 — FINANCEIRO (9 etapas)

## 2.1 — Plano de contas + Centro de custo
## 2.2 — Categorias financeiras
## 2.3 — Contas a pagar (CRUD + upload NF)
## 2.4 — Contas a receber (CRUD + link com Vendas)
## 2.5 — Formas de pagamento + Meios de recebimento
## 2.6 — Conciliação bancária (import OFX + manual)
## 2.7 — Fluxo de caixa (realizado + projetado)
## 2.8 — DRE (Demonstração de Resultado)
## 2.9 — Emissão de boleto (integração banco) — **✅ FECHA A FASE 2.**

---

# ☕ FASE 3 — ESTOQUE / PRODUÇÃO (6 etapas)

## 3.1 — Cadastro de produtos (cru, torrado, embalado)
## 3.2 — Ficha técnica (BOM)
## 3.3 — Ordem de Produção (OP)
## 3.4 — Controle de lote (rastreabilidade)
## 3.5 — Estoque multi-depósito + movimentação
## 3.6 — Inventário + ajuste de estoque — **✅ FECHA A FASE 3.**

---

# 📜 FASE 4 — FISCAL (4 etapas)

## 4.1 — Cadastro fiscal (NCM, CFOP, CST)
## 4.2 — Integração Focus NFe
## 4.3 — Emissão de NFe de saída
## 4.4 — Reforma Tributária (CBS + IBS) — **✅ FECHA A FASE 4.**

---

# 🤖 FASE 5 — IA + n8n + WHATSAPP (11 etapas)

> **Esta é a fase mais turbinada da V2.** Recebeu 3 etapas novas direto da pesquisa 2026.

## 5.1 — n8n self-hosted em Hostinger VPS
- **O que faz:** Instalar n8n em VPS Contabo/Hostinger + EasyPanel + Postgres + Redis + HTTPS.
- **Custo:** ~R$ 40-60/mês.
- **Fonte:** [Hora de Codar — n8n VPS Brasil](https://horadecodar.com.br/agente-cobranca-whatsapp-n8n-pix-boleto-followup/).

## 5.2 — Conectar n8n ao Supabase
- **O que faz:** Webhooks bidirecionais. Supabase dispara n8n em eventos (venda nova, conta vencendo).

## 5.3 — OCR de NF de entrada
- **O que faz:** Gabriel fotografa NF → n8n chama OCR.space → cria conta a pagar automática.

## 5.4 — Classificação automática de lançamento
- **O que faz:** IA (GPT-5/Claude) classifica descrição em categoria financeira.

## 5.5 — Alertas inteligentes (WhatsApp)
- **O que faz:** Saldo baixo, conta vencer, estoque crítico → WhatsApp via Evolution API.

## ✏️ 5.6 — Bot WhatsApp Vendas — **CADASTRO POR ÁUDIO** 🆕
- **O que faz:** Vendedor ou Gabriel manda áudio no WhatsApp da empresa: *"Vende 3 quilos de café gourmet pro Café Jireh, parcelado em 2 vezes no boleto"*. Bot transcreve com **Whisper**, IA interpreta, cria venda no Supabase, **gera 2 boletos no Inter/Banco do Brasil API**, envia confirmação via texto + áudio de volta no WhatsApp.
- **Por que:** Fim de papel, fim de digitação. Vendedor na rua tira pedido por áudio. Gabriel viajando cria venda só falando.
- **Exemplo dia-a-dia:** É igual aquele entregador de gás que liga e fala "manda 2 botijão na rua tal" — antes anotava num caderno, perdia. Agora o sistema escuta, anota, manda boleto. Mesma coisa, mas pra venda de café.
- **Stack:**
  - **Evolution API** (open source, grátis, conecta WhatsApp não-oficial) ou **WhatsApp Business Cloud API oficial Meta** (mais seguro, R$ 0,05 por mensagem)
  - **Whisper da OpenAI** pra transcrever áudio (US$ 0,006 por minuto)
  - **Claude/GPT** pra interpretar intenção e extrair dados (cliente, produto, quantidade, forma de pgto)
  - **n8n** orquestra tudo
  - **Supabase** grava a venda
- **Arquivos afetados:** Workflow JSON em `n8n-workflows/bot-vendas-audio.json` + Edge Function Supabase pra validar dados.
- **Risco se pular:** Nenhum funcional — só perde produtividade absurda.
- **Depende de:** 5.1, 5.2, Fase 2 completa (precisa contas a receber funcionando).
- **Fonte:** [Reddit r/n8n — Bot WhatsApp + voz que faz 90% do atendimento](https://www.reddit.com/r/n8n/comments/1sc3i30/i_built_a_whatsapp_voice_ai_agent_in_n8n_that/), [Escala XZ — Transcrever áudio WhatsApp com Whisper](https://www.youtube.com/watch?v=i3ZEkL3eAkg), [n8n.io — Customer Service Voice + FAQ](https://n8n.io/workflows/8454-automate-whatsapp-customer-support-with-voice-transcription-faq-and-appointment-scheduling/).

## 🆕 5.7 — Cobrança automática PIX/Boleto + régua de follow-up
- **O que faz:** Conta a receber criada → n8n gera **PIX dinâmico via Banco do Brasil/Inter API** → envia QR Code + copia-cola pelo WhatsApp → agenda lembretes automáticos:
  - Dia da venda: PIX + texto
  - 3 dias antes do vencimento: lembrete amigável
  - Dia do vencimento: aviso firme
  - 3 dias após: cobrança 1
  - 7 dias após: oferta de renegociação
  - Pagamento confirmado (webhook do banco): para a régua + envia agradecimento
- **Por que:** Hoje o cliente esquece, Gabriel cobra na mão. Automatizado, **inadimplência cai 40-60%** segundo casos Hora de Codar.
- **Exemplo dia-a-dia:** É igual cobrador da Sabesp/Enel — eles te mandam SMS antes de cortar. Ninguém precisa lembrar de cobrar, o sistema lembra.
- **Stack:** n8n + Evolution API + AbacatePay (ou direto na API do banco) + webhook do banco pra detectar pagamento.
- **Arquivos afetados:** `n8n-workflows/regua-cobranca.json` + tabela `cobrancas_log` no Supabase.
- **Risco se pular:** Médio — inadimplência continua manual.
- **Depende de:** 2.4 (contas a receber), 5.6 (Evolution API já conectada).
- **Fonte:** [Hora de Codar — Régua de cobrança WhatsApp](https://horadecodar.com.br/agente-cobranca-whatsapp-n8n-pix-boleto-followup/), [YouTube — Pix automático com IA + n8n + AbacatePay](https://www.youtube.com/watch?v=jerVXOLfjbA).

## 5.8 — Automação fiscal
- **O que faz:** XML enviado pro contador automático, guia de imposto com alerta.

## 5.9 — Automação de estoque
- **O que faz:** Estoque abaixo do mínimo → cotação automática nos fornecedores.

## 🆕 5.10 — Cursor Cloud Agents pra tarefas paralelas
- **O que faz:** Quando Gabriel pedir "adiciona dark mode + corrige bug X + escreve teste pro módulo Y", em vez de Cursor fazer 1 por vez, Cursor dispara **3 Cloud Agents paralelos**, cada um numa VM isolada, que trabalham em PRs separados ao mesmo tempo. Cada agent **grava vídeo de prova** mostrando que o código funciona.
- **Por que:** Velocidade absurda. **30% dos PRs do próprio Cursor são feitos por agents** ([NxCode](https://www.nxcode.io/resources/news/cursor-cloud-agents-virtual-machines-autonomous-coding-guide-2026)). Pra Gabriel: virar tarefa que tomava 3 dias em 4 horas.
- **Exemplo dia-a-dia:** É igual contratar 3 pintores ao mesmo tempo pra pintar 3 cômodos diferentes da casa. Antes era 1 pintor pintando tudo em sequência (1 semana). Com 3 paralelos, acaba em 2 dias.
- **Como liga:** Plano PRO Cursor já tem. Só usar "Run as Cloud Agent" em vez de chat normal.
- **Risco se pular:** Nenhum — só usa Cursor sequencial. Mais lento, mas funciona.
- **Depende de:** 0.5 (Bugbot já revisando os PRs dos agents).
- **Fonte:** [NxCode — Cursor Cloud Agents Guide 2026](https://www.nxcode.io/resources/news/cursor-cloud-agents-virtual-machines-autonomous-coding-guide-2026).

## 🆕 5.11 — Cursor Automations (PR review + segurança + incidentes)
- **O que faz:** Configurar Cursor Automations que rodam **sempre que algo acontece**:
  - **Push pra main** → agent faz security audit + posta achados de risco no Slack/Telegram
  - **Issue nova no GitHub** → agent investiga, classifica, marca duplicado se for
  - **Toda segunda 9h** → agent gera resumo da semana com tudo que mudou
  - **PR mergeado** → agent verifica se cobertura de teste caiu
- **Por que:** Sistema "auto-pilotado". Gabriel não precisa lembrar de revisar segurança, gerar relatório semanal, etc.
- **Exemplo dia-a-dia:** É igual câmera com sensor de movimento — não precisa apertar nada, ela liga sozinha quando vê alguém. Cursor Automations liga agents sozinhos quando vê evento.
- **Como liga:** [cursor.com/automations](https://cursor.com/automations) → criar automation a partir de template.
- **Risco se pular:** Baixo — sistema funciona sem.
- **Depende de:** 0.5, 0.6, 5.10.
- **Fonte:** [Cursor Blog — Automations](https://cursor.com/blog/automations), [Help Net Security — Cursor Automations](https://www.helpnetsecurity.com/2026/03/06/cursor-automations-turns-code-review-and-ops-into-background-tasks/).
- **✅ FECHA A FASE 5.**

---

# 📊 FASE 6 — BI (4 etapas)

## 6.1 — Dashboard executivo
## 6.2 — Margem por cliente/produto/lote
## 6.3 — Estoque parado + giro
## 6.4 — Exportação Excel/PDF — **✅ FECHA A FASE 6.**

---

# 📱 FASE 7 — MOBILE + ROLES (4 etapas)

## 7.1 — Papéis e permissões (RBAC)
## 7.2 — PWA (Progressive Web App)
## 7.3 — Telas mobile específicas
## 7.4 — Login biométrico + 2FA — **✅ FECHA A FASE 7. SISTEMA COMPLETO.**

---

## Mapa de dependências críticas (V2)

| Quebrar essa etapa | Quebra também |
|---|---|
| 0.4 (multi-tenant) | 1.10 (RLS por empresa) |
| 0.5 (Bugbot) | 0.7 (regras Bugbot), 5.10, 5.11 |
| 0.6 (MCP) | Cursor anda às cegas em relação ao banco |
| 1.1 (JWT backend) | 1.2 (Bearer frontend) |
| 1.5 (publishable key) | 1.6, 1.7, 1.8 (persistência) |
| 2.4 (contas a receber) | 5.7 (cobrança automática) |
| 5.1 (n8n) | 5.2-5.11 todas |
| 5.6 (bot áudio) | 5.7 (régua), 5.5 (alertas) |

---

## Estimativa de tempo (V2 com superpoderes)

**Sem superpoderes (versão antiga):** 6-8 meses sozinho.

**Com Cursor Cloud Agents + Bugbot Autofix + MCP + bot áudio:**
- Fase 0: 2-3 dias (incluindo ligar Bugbot e MCP — 1 hora)
- Fase 1: 1-2 semanas
- Fase 2: 3-4 semanas
- Fase 3: 3-4 semanas
- Fase 4: 2-3 semanas (depende de NFe homologada)
- Fase 5: 4-6 semanas (a fase mais pesada — todo o n8n + WhatsApp)
- Fase 6: 2 semanas
- Fase 7: 2 semanas

**Total estimado: 3,5 a 5 meses** com Gabriel + Perplexity + Cursor + Bugbot trabalhando juntos.

---

## Como o Cursor deve usar este arquivo

Antes de executar qualquer etapa:
1. **@-menciona** `@ROADMAP-49-ETAPAS-V2-SUPERPODERES` no início do prompt
2. Lê a etapa específica + dependências
3. Verifica se anteriores realmente concluídas
4. Se achar conflito, **avisa Gabriel e Perplexity antes de codar**
5. Se descobrir melhoria, **sugere antes de executar**
6. **Se Bugbot apontar bug, Cursor lê os comentários e considera no próximo PR**

---

## Fontes da pesquisa Ultra Link Profunda Master (30/04/2026)

**Cursor Cloud Agents + Bugbot:**
- [NxCode — Cursor Cloud Agents Guide 2026](https://www.nxcode.io/resources/news/cursor-cloud-agents-virtual-machines-autonomous-coding-guide-2026)
- [Cursor Blog — Bugbot Autofix](https://cursor.com/blog/bugbot-autofix)
- [Cursor Blog — Automations](https://cursor.com/blog/automations)
- [WorkOS — Bugbot Autoreview Claude Code PRs](https://workos.com/blog/cursor-bugbot-autoreview-claude-code-prs)
- [TechCrunch — Cursor Automations](https://techcrunch.com/2026/03/05/cursor-is-rolling-out-a-new-system-for-agentic-coding/)
- [AnyCap — Cursor 2026 Features](https://anycap.ai/page/en-US/news/cursor-ai-2026-new-features-guide)

**Claude Code 2026:**
- [Builder.io — Claude Code March 2026 Updates](https://www.builder.io/blog/claude-code-updates)

**MCP (Model Context Protocol):**
- [Supabase Docs — MCP](https://supabase.com/docs/guides/getting-started/mcp)
- [Supabase Blog — MCP Server](https://supabase.com/blog/mcp-server)
- [DesignRevision — Supabase MCP Guide 2026](https://designrevision.com/blog/supabase-mcp-server)

**n8n + WhatsApp + Áudio:**
- [Reddit r/n8n — WhatsApp + Voice AI Agent (case real, 12 meses, 90% atendimento)](https://www.reddit.com/r/n8n/comments/1sc3i30/i_built_a_whatsapp_voice_ai_agent_in_n8n_that/)
- [Ritz7 — WhatsApp AI Agent n8n 2026 Step-by-Step](https://ritz7.com/blog/whatsapp-automation-build-chatbots-with-n8n)
- [Escala XZ YouTube — Transcrever áudio WhatsApp com Whisper + Evolution + n8n](https://www.youtube.com/watch?v=i3ZEkL3eAkg)
- [Hora de Codar — Agente cobrança WhatsApp PIX boleto régua](https://horadecodar.com.br/agente-cobranca-whatsapp-n8n-pix-boleto-followup/)
- [Hora de Codar — Automatizar PIX WhatsApp Evolution API](https://www.horadecodar.com.br/automatizar-pix-whatsapp-n8n-evolution-api/)
- [n8n.io — Customer Service Voice + FAQ + Appointment](https://n8n.io/workflows/8454-automate-whatsapp-customer-support-with-voice-transcription-faq-and-appointment-scheduling/)
- [YouTube — Pix automático IA + n8n + AbacatePay](https://www.youtube.com/watch?v=jerVXOLfjbA)
- [YouTube — Vendas automático WhatsApp n8n com áudio](https://www.youtube.com/watch?v=XbL2RXf9s1s)

---

**FIM DO ROADMAP V2. Atualizar sempre que etapa for concluída (✅) ou descobrir dependência nova.**

**Versão:** 2.0 — 30/04/2026
**Próxima a executar:** Etapa 1.1 (JWT ES256 backend) ou Etapa 0.5 (Bugbot — pode ser feita em paralelo, 1h).
