# INVENTÁRIO COMPLETO — Programas e Ferramentas

**Projeto:** Sistema-Financeiro-Geral (ERP Patrocínio Café — Fase 1)
**Dono:** Judson Gabriell Martins (Gabriel / Visionário)
**Local:** PC Branco — Goiânia-GO
**Data do relatório:** 29/04/2026

---

## 1. INSTALADOS NO PC BRANCO (Windows)

### 1.1. Linguagens / Runtime
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 1 | Node.js LTS | v24.15.0 | MSI oficial nodejs.org (29/04/2026 — substituiu v25 que dava conflito) |
| 2 | npm | v11.12.1 | Veio junto com Node |
| 3 | TypeScript (global) | v6.0.3 | `npm install -g typescript` |
| 4 | tsx (global) | v4.21.0 | `npm install -g tsx` |
| 5 | Java JDK | v1.8.0_491 | Pré-existente (não usado no ERP) |

### 1.2. Gerenciadores de pacote
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 6 | Scoop | v0.5.3 | Script oficial `get.scoop.sh` |
| 7 | pnpm | v10.33.2 | `npm install -g pnpm` |
| 8 | Corepack | v0.34.6 | Veio com Node |

### 1.3. CLIs de serviços (deploy / banco / repo)
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 9 | Supabase CLI | v2.95.4 | Via Scoop (`scoop install supabase`) |
| 10 | Vercel CLI | v52.0.0 | `npm install -g vercel` |
| 11 | Railway CLI | v4.44.0 | Instalador oficial |
| 12 | GitHub CLI (gh) | v2.92.0 | Instalador oficial |

### 1.4. Terminais
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 13 | Windows PowerShell | v5.x | Veio com Windows |
| 14 | PowerShell 7 | v7.6.1 | Via Scoop (`scoop install pwsh`) |

### 1.5. IDEs / Editores
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 15 | Cursor IDE | (atual) | Instalador oficial cursor.com |

### 1.6. Versionamento
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 16 | Git for Windows | v2.53.0 | Instalador oficial git-scm.com |

### 1.7. Testes de API
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 17 | Insomnia | (atual) | Instalador oficial insomnia.rest (logado com GitHub `gabriellnovak2-max`) |

### 1.8. Utilitários bônus
| # | Programa | Versão | Como foi instalado |
|---|---|---|---|
| 18 | 7-Zip | v26.01 | Veio junto com Supabase via Scoop |

---

## 2. SERVIÇOS ONLINE / CONTAS (Planos Pro)

| # | Serviço | Pra que serve | Plano |
|---|---|---|---|
| 19 | GitHub | Repositório do código (`gabriellnovak2-max/Sistema-Financeiro-Geral`) | Copilot Pro |
| 20 | Vercel | Hospedagem do frontend (sistema-financeiro-geral.vercel.app) | Pro |
| 21 | Supabase | Banco de dados Postgres + Auth + Storage (project: `ekmjyubgknfssoqafxri`) | Pro |
| 22 | Railway | Hospedagem do backend Express (sistema-financeiro-geral-production.up.railway.app) | Pro |

---

## 3. AGENTES DE IA EM USO

| # | Agente | Onde roda | Função |
|---|---|---|---|
| 23 | Perplexity Computer | Web (perplexity.ai) | Cérebro estratégico, pesquisa, MCPs (Vercel, Supabase, GitHub) |
| 24 | Cursor (Claude Sonnet) | Cursor IDE no PC | Editar código, rodar terminal, validar local |
| 25 | Cursor (Claude Opus 4.7) | Cursor IDE no PC | Mesma coisa, modelo mais robusto pra tarefas complexas |
| 26 | Claude Code | CLI no PC | Alternativa ao Cursor pra quem prefere terminal puro |

---

## 4. EXTENSÕES / PACOTES NPM DENTRO DO PROJETO

Stack obrigatória do ERP (instalado dentro de `node_modules` do repo):
- React 18 + TypeScript
- Vite (build do frontend)
- Tailwind CSS + shadcn/ui (UI)
- Express 5 (backend Node)
- Drizzle (ORM — em transição pra Supabase direto)
- Supabase JS Client (`@supabase/supabase-js`)
- React Hook Form + Zod (formulários)

---

## 5. SUBSCRIBES / FERRAMENTAS PARALELAS DO GABRIEL

Não diretamente instaladas no PC, mas em uso pelo projeto:
- Google Drive / OneDrive (backup de docs, mas projeto NÃO deve ficar aqui — gerou bug do iCloud)
- Google Calendar / Tasks (organização)
- Microsoft Teams (comunicação)
- YouTube Analytics (canal Patrocínio Café)
- Google Sheets (planilhas paralelas)

---

## 6. O QUE FALTA INSTALAR (decisão futura)

| Programa | Necessidade | Recomendação |
|---|---|---|
| Docker Desktop | Rodar Supabase local | Talvez vale, mas pesa 4GB de RAM ligado |
| Postman | Alternativa ao Insomnia | NÃO precisa, Insomnia já cobre |
| Prisma | ORM alternativo | NÃO precisa, usamos Supabase direto |

---

## 7. AVISOS E PENDÊNCIAS

🚨 **iCloud**: Cursor tá trabalhando em `C:\Users\gabri\iCloudDrive\...` — local errado (causou "fantasmas" do Git no 23/04). Correto: pasta `Sistema-Financeiro-Geral.CLEAN-20260423` fora do iCloud.

🚨 **Railway**: API expondo `/api/vendas` SEM JWT (testado 29/04/2026 11:18 BRT — retornou Status 200 com dados de vendas reais). Fix em execução.

🚨 **PATH Windows**: Scoop e Supabase às vezes não aparecem no PATH da sessão atual. Solução temporária: rodar `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")` em sessão nova quando der "comando não reconhecido".

---

## 8. RESUMO DA EVOLUÇÃO

- **Antes do 21/04/2026**: PC tinha só Node v25 (errado), npm, Git, Cursor IDE.
- **22/04/2026**: Adicionados Vercel CLI, Railway CLI, GitHub CLI.
- **29/04/2026** (HOJE): Migração Node v25 → v24 LTS, instalação de Scoop, Supabase CLI, PowerShell 7, TypeScript+tsx global, pnpm, Insomnia.

**Total de itens instalados/configurados:** 18 programas + 4 contas Pro + 4 agentes de IA = **26 ferramentas no ecossistema.**

---

*Documento gerado pela Perplexity Computer em 29/04/2026 às 11:33 BRT, com base no histórico completo da conversa e memória do projeto.*
