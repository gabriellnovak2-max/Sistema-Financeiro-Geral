# LEIA-ME-PRIMEIRO — Cursor, esse é o cérebro do Gabriel

> **Cursor: este é o PRIMEIRO arquivo que você lê quando abre este repo em qualquer PC.**
> O Gabriel (Visionário) trabalha em **3 PCs diferentes** (branco, preto, notebook). Cada PC pode ter ferramentas faltando. Antes de qualquer tarefa técnica, segue o roteiro abaixo.

---

## 🎯 Quem é o Gabriel

- **Nome:** Judson Gabriell Martins. Chamar de **Gabriel** ou **Visionário**.
- **Empresa:** Patrocínio Café (torrefação private label, Goiânia-GO).
- **Não é técnico.** Explicar passo-a-passo, sem jargão, com exemplo do dia-a-dia (mercado, posto, padaria — **nunca exemplo de amizade**).
- **Idioma:** PT-BR informal mineiro/goiano. Sem "vamos lá", sem motivação genérica, sem emoji.

Ler `.cursor/rules/gabriel-humanizado.mdc` e `.cursor/rules/cerebro-operacional.mdc` para regras completas.

---

## 🚨 REGRA ZERO — GIT (inegociável)

**3 IAs mexem no mesmo repo: Perplexity, Cursor e Claude Code.** Se alguém esquecer Git, destrói trabalho do outro.

**ANTES de qualquer alteração:**
```bash
git fetch --all
git pull origin main
git status
```

**DEPOIS de qualquer alteração:**
```bash
git add <arquivos>
git commit -m "<mensagem em PT-BR>"
git push origin main
```

E avisar o Gabriel: "Commit `<hash>` na branch `main`, Visionário."

---

## 🖥️ Roteiro pro Cursor quando abrir em PC novo

### Passo 1 — Identificar o PC
Pergunta pro Gabriel: **"Visionário, você tá no PC branco, preto ou notebook?"**

### Passo 2 — Verificar ferramentas instaladas
Compara com o inventário completo em `docs/cerebro-portatil/inventario-completo-programas.md`. Lista o que falta.

### Passo 3 — Instalar o que falta
Se faltar coisa, manda o Gabriel rodar:
```powershell
.\scripts\setup-pc.ps1
```
(Esse script usa `winget` pra instalar tudo de uma vez.)

### Passo 4 — Localização correta do projeto
**O Cursor NÃO PODE trabalhar em pasta dentro do iCloud.** Caminho oficial:
- PC branco: `C:\dev\Sistema-Financeiro-Geral`
- PC preto: `C:\dev\Sistema-Financeiro-Geral`
- Notebook: `C:\dev\Sistema-Financeiro-Geral`

Se estiver em `iCloudDrive`, **mover antes de mexer**.

### Passo 5 — Validar Git e branch
```bash
git branch --show-current   # tem que ser 'main'
git status                  # tem que estar limpo
git pull origin main        # sempre antes de começar
```

---

## 🧠 Cérebro Portátil — 4 camadas

O cérebro do Gabriel é **portátil** entre os 3 PCs. Funciona assim:

| Camada | O que faz | Onde mora |
|---|---|---|
| **1. `.cursor/rules/`** | Regras do projeto (persona, ordem sagrada, stack) | Neste repo, vai junto com Git |
| **2. User Rules da conta Cursor** | Regras pessoais do Gabriel | Conta Cursor — sincroniza sozinho |
| **3. MCP Memory Server** | Memória persistente entre sessões | Servidor local + arquivo sqlite |
| **4. memoir-cli** | Backup/restore de configs de IA | CLI: `memoir push` / `memoir pull` |

Ler detalhes em `docs/cerebro-portatil/`.

---

## 📋 Estado atual do projeto (verificado 30/04/2026)

- **Stack:** React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase
- **GitHub:** gabriellnovak2-max/Sistema-Financeiro-Geral
- **Vercel:** 🟢 https://sistema-financeiro-geral.vercel.app
- **Railway:** 🔴 ainda expondo `/api/vendas` sem JWT — checar deploy do commit `da0bb20`
- **Supabase project_id:** ekmjyubgknfssoqafxri
- **5 tabelas:** clientes, vendas, contas_pagar, contas_receber, lancamentos
- **Branch viva:** `main`. Branch divergente: `claude/debug-sales-app-i579c`.

---

## 🛣️ Roadmap oficial

**55 etapas** em `docs/cerebro-portatil/ROADMAP-49-ETAPAS-V2-SUPERPODERES.md`.

**Ordem Sagrada (NUNCA inverter):**
1. Architecture
2. Blindagem (RLS, Auth, segurança)
3. Financeiro
4. OP (Ordem de Produção)
5. Fiscal
6. IA
7. BI
8. Mobile

n8n só na Fase 3. Não antecipar.

---

## ✅ Checklist mental pro Cursor antes de cada tarefa

- [ ] Li `.cursor/rules/gabriel-humanizado.mdc`?
- [ ] Li `.cursor/rules/cerebro-operacional.mdc`?
- [ ] Sei em qual PC o Gabriel tá?
- [ ] Fiz `git pull origin main` antes?
- [ ] Vou fazer `git push` depois?
- [ ] Vou explicar em PT-BR informal, com O QUE + POR QUÊ + EXEMPLO do dia-a-dia?
- [ ] Vou esperar confirmação do Gabriel antes de avançar?

---

**Próximo passo:** abre este repo, lê esse arquivo, e pergunta pro Gabriel em qual PC ele tá. Depois roda o checklist.
