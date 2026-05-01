# Auditoria Cursor — Cérebro Portátil

**Data:** 30/04/2026
**Auditor:** Cursor (Claude Opus 4.7)
**Commit auditado:** `92ae8d1`
**Branch:** `main`
**Local da auditoria:** `Sistema-Financeiro-Geral.CLEAN-20260423` (atenção: ainda em iCloud, não em `C:\dev\`)

---

## 1. O que foi verificado

- `git fetch --all` + `git pull origin main` → repo já em `92ae8d1`
- 11 arquivos novos lidos integralmente
- Comparação com regras já existentes (`gabriel-humanizado.mdc`, `cerebro-operacional.mdc`)
- Soma das etapas do roadmap V2

## 2. O que está certo

| Item | Status | Observação |
|---|---|---|
| HEAD em `92ae8d1` | OK | Bate com o que Perplexity reportou |
| `.cursor/rules/setup-novo-pc.mdc` | OK | Frontmatter válido + `alwaysApply: true` |
| `.cursor/rules/roadmap-oficial.mdc` | OK | Frontmatter válido + Ordem Sagrada coerente |
| `LEIA-ME-PRIMEIRO.md` (estrutura) | OK | Cobre persona, Git, roteiro, estado do projeto, roadmap |
| `docs/cerebro-portatil/README.md` | OK | Índice claro das 4 camadas |
| `docs/cerebro-portatil/01-cursor-rules.md` | OK | Explicação correta sobre `.cursor/rules/` |
| `docs/cerebro-portatil/02-user-rules.md` | OK | Bloco oficial de User Rules + procedimento |
| `docs/cerebro-portatil/03-mcp-memory-server.md` | OK | Setup técnico do `doobidoo/mcp-memory-service` consistente |
| `docs/cerebro-portatil/04-memoir-cli.md` | OK | Procedimento `push/pull` claro |
| `docs/cerebro-portatil/inventario-completo-programas.md` | OK | Inventário coerente com a auditoria de versões |
| Roadmap V2 — total de etapas | OK | 7+10+9+6+4+11+4+4 = **55** |
| `scripts/setup-pc.ps1` (estrutura) | OK | Cobre winget + npm + Scoop + PATH |

## 3. O que está errado / inconsistente

### 3.1 Conflito sobre fase do n8n
- `LEIA-ME-PRIMEIRO.md` linha 114: `n8n só na Fase 3. Não antecipar.`
- `roadmap-oficial.mdc` linha 24: `n8n só na Fase 5. Antes não.`
- `02-user-rules.md` linha 36: `n8n só na Fase 5`
- Roadmap V2: Fase 5 = `IA + n8n + WhatsApp`

→ **Erro no `LEIA-ME-PRIMEIRO.md`**: deveria dizer **Fase 5** (não Fase 3). Corrigir.

### 3.2 `setup-pc.ps1` instala Supabase CLI por npm
- Linha 46: `$npmTools = @("typescript", "tsx", "pnpm", "supabase", "vercel", "@railway/cli", "memoir-cli")`
- Supabase **não suporta** instalação global via `npm` no Windows (já testamos em sessão anterior).
- Caminho correto no Windows é via Scoop (já documentado no `inventario-completo-programas.md`).

→ **Sugestão**: remover `supabase` da lista npm e adicionar bloco Scoop com `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git; scoop install supabase`.

### 3.3 `setup-pc.ps1` não cria `C:\dev` antes
- O LEIA-ME diz que o caminho correto do projeto é `C:\dev\Sistema-Financeiro-Geral`.
- Mas o script não cria `C:\dev` nem clona o repo.

→ **Sugestão**: adicionar passo final `New-Item -ItemType Directory -Path C:\dev -Force` e mensagem orientando o `git clone` para esse caminho.

### 3.4 Local atual ainda em iCloud
- LEIA-ME linha 57-60 diz que projeto **não pode** estar em `iCloudDrive`.
- Mas a auditoria está rodando em `iCloudDrive\...\Sistema-Financeiro-Geral.CLEAN-20260423`.

→ **Pendência real**: mover o repo para fora do iCloud em todos os PCs. Já está marcado na ordem pendente como item 1.

### 3.5 README do cérebro portátil cita ferramenta "memoir login"
- O arquivo `04-memoir-cli.md` é claro, mas o passo 2 do `README.md` mostra `memoir login` antes de `memoir pull`. Tudo bem, só vale validar que o pacote `memoir-cli` realmente existe no npm registry **antes** de incluir no script (não foi validado online nesta auditoria).

→ **Sugestão**: confirmar disponibilidade real de `memoir-cli` no npm registry antes do PC novo rodar `setup-pc.ps1`.

### 3.6 Aviso sobre Node 22 vs Node 24
- `inventario-completo-programas.md` declara Node `v24.15.0` como referência.
- Hoje, no terminal do Cursor (PC branco), `node -v` retorna `v22.22.0`, porque o PATH prioriza o helper interno do Cursor.
- O Node 24 está instalado (validado por caminho absoluto), mas não é o ativo na sessão.

→ **Sugestão**: incluir no `setup-novo-pc.mdc` (passo 4) a instrução para reiniciar o terminal após o setup, garantindo PATH correto.

## 4. Validação `alwaysApply`

- `setup-novo-pc.mdc`: `alwaysApply: true` ✅
- `roadmap-oficial.mdc`: `alwaysApply: true` ✅
- `gabriel-humanizado.mdc`: já existia, segue válido
- `cerebro-operacional.mdc`: já existia, segue válido

→ Frontmatter válido nos 4. Cursor aplica automaticamente.

## 5. Recomendações resumidas

1. Corrigir `LEIA-ME-PRIMEIRO.md` (linha 114): `Fase 3` → `Fase 5`.
2. Ajustar `scripts/setup-pc.ps1`:
   - tirar `supabase` do bloco npm
   - adicionar bloco Scoop para Supabase CLI
   - criar `C:\dev` se não existir
   - opcional: orientar `git clone` automático
3. Confirmar disponibilidade real do pacote `memoir-cli` no npm.
4. Mover repo de `iCloudDrive` para `C:\dev\Sistema-Financeiro-Geral` em todos os PCs.
5. Adicionar nota sobre PATH/Node 22 vs Node 24 no `setup-novo-pc.mdc`.

## 6. Próximas opções (sem escolher sozinho)

- **A)** Instalar e configurar **MCP Memory Server** agora no PC branco.
- **B)** Rodar `memoir init` + `memoir push` agora pra criar primeiro backup.
- **C)** Voltar pro roadmap (Etapa 1.x ou 0.5/0.6/0.7) e seguir o desenvolvimento do ERP.

Aguardando decisão do Visionário.
