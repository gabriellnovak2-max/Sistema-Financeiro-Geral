# Camada 3 — MCP Memory Server

## O que é

Servidor MCP que dá **memória persistente** pro Cursor. Toda decisão importante que rola numa conversa fica salva num banco local (sqlite). Quando o Cursor abre nova sessão, lembra de tudo.

## Recomendação: `doobidoo/mcp-memory-service`

- **Repo:** https://github.com/doobidoo/mcp-memory-service
- **Backend:** sqlite_vec (offline, leve, <100MB)
- **Linguagem:** Python
- **Funciona offline.** Não depende de internet pra lembrar.

## Como instalar (uma vez por PC)

### 1. Pré-requisitos
- Python 3.10+ (já tá em todos os PCs do Gabriel)
- `pip install uv` (gerenciador rápido de pacotes Python)

### 2. Clonar e instalar
```powershell
cd C:\dev
git clone https://github.com/doobidoo/mcp-memory-service.git
cd mcp-memory-service
uv venv
.\.venv\Scripts\Activate.ps1
uv pip install -e .
```

### 3. Configurar Cursor pra usar
Edita `~/.cursor/mcp.json` (ou `%USERPROFILE%\.cursor\mcp.json` no Windows):

```json
{
  "mcpServers": {
    "memory": {
      "command": "uv",
      "args": [
        "--directory",
        "C:\\dev\\mcp-memory-service",
        "run",
        "memory-service"
      ],
      "env": {
        "MCP_MEMORY_BACKEND": "sqlite_vec",
        "MCP_MEMORY_SQLITE_PATH": "C:\\dev\\cerebro-gabriel.db"
      }
    }
  }
}
```

### 4. Reiniciar Cursor

Vai aparecer ícone do MCP no canto inferior. Cursor passa a chamar `memory.store()` e `memory.recall()` sozinho.

## Portabilidade entre PCs

**O arquivo `cerebro-gabriel.db` é o cérebro.** Pra levar pra outro PC:

**Opção A — Sincroniza via OneDrive/iCloud/Google Drive**
Coloca o `.db` em pasta sincronizada. Simples mas pode dar conflito se 2 PCs editam ao mesmo tempo.

**Opção B — Sincroniza via Git** (recomendado)
Cria repo privado só pro `.db`. Antes de abrir Cursor: `git pull`. Depois: `git push`.

**Opção C — Backup manual**
Copia `cerebro-gabriel.db` num pendrive ou SSD externo quando trocar de PC.

## Alternativa: `brain-mcp`

Mais simples, menos features. Repo: https://github.com/eric-emc/brain-mcp.

## Exemplo do dia-a-dia

É igual o caderno de cliente do mecânico. Cada vez que o carro do Gabriel entra na oficina, o mecânico abre o caderno e vê: "Ah, esse cara tá com problema na embreagem desde março, já trocou óleo em janeiro." Não precisa perguntar tudo de novo. O cérebro do Cursor funciona igual — abre a sessão e ele já sabe que você é o Gabriel da Patrocínio Café, que o ERP tá na fase Financeiro, que o Railway tá com bug em /api/vendas.

## Referências

- [doobidoo/mcp-memory-service](https://github.com/doobidoo/mcp-memory-service)
- [Top Remote MCP Servers — DataCamp](https://www.datacamp.com/blog/top-remote-mcp-servers)
