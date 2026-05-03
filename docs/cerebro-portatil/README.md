# Cérebro Portátil — Índice

Documentação das 4 camadas que tornam o cérebro do Gabriel portátil entre os 3 PCs.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [01-cursor-rules.md](./01-cursor-rules.md) | Regras `.cursor/rules/` no Git |
| [02-user-rules.md](./02-user-rules.md) | User Rules da conta Cursor (sincroniza sozinho) |
| [03-mcp-memory-server.md](./03-mcp-memory-server.md) | MCP Memory Server (memória persistente) |
| [04-memoir-cli.md](./04-memoir-cli.md) | memoir-cli (backup/restore configs IA) |
| [ROADMAP-CANONICO-59-MAIS.md](./ROADMAP-CANONICO-59-MAIS.md) | Fonte oficial unica (59+) |
| [MATRIZ-EQUIVALENCIA-ROADMAP.md](./MATRIZ-EQUIVALENCIA-ROADMAP.md) | Equivalencia antigo (49/52/55) -> canonico |
| [CHECKLIST-ANTI-PULO-DE-ETAPA.md](./CHECKLIST-ANTI-PULO-DE-ETAPA.md) | Checklist obrigatorio de bloqueio |
| [ROADMAP-49-ETAPAS-V2-SUPERPODERES.md](./ROADMAP-49-ETAPAS-V2-SUPERPODERES.md) | Roadmap legado detalhado (preservado) |
| [inventario-completo-programas.md](./inventario-completo-programas.md) | Lista de todos os programas instalados |

## Setup rápido em PC novo

```powershell
# 1. Instala ferramentas
.\scripts\setup-pc.ps1

# 2. Loga em todos os serviços
gh auth login
vercel login
railway login
supabase login
memoir login

# 3. Restaura configs de IA
memoir pull

# 4. Abre Cursor logado com mesma conta
```

## Em qual ordem ler

1. `LEIA-ME-PRIMEIRO.md` (raiz do repo)
2. `01-cursor-rules.md`
3. `02-user-rules.md`
4. `03-mcp-memory-server.md`
5. `04-memoir-cli.md`

## Regra oficial de governanca de roadmap

- **Fonte oficial unica:** `ROADMAP-CANONICO-59-MAIS.md`
- **Mapeamento historico obrigatorio:** `MATRIZ-EQUIVALENCIA-ROADMAP.md`
- **Bloqueio anti-pulo:** `CHECKLIST-ANTI-PULO-DE-ETAPA.md`
- O arquivo `ROADMAP-49-ETAPAS-V2-SUPERPODERES.md` permanece preservado como legado/detalhamento e nao deve ser removido.
