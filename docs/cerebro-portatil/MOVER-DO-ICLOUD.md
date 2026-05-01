# Mover Sistema-Financeiro-Geral do iCloud pra C:\dev\

## Por que isso é urgente

O Cursor tá trabalhando em `C:\Users\gabri\iCloudDrive\...`. Isso é **errado** porque:

- iCloud sincroniza fora de hora e quebra arquivo no meio do build
- Race condition: você salva, iCloud sobe, outro PC baixa versão velha por cima
- `node_modules` (centenas de MB) entope upload do iCloud
- Git pode ficar confuso com arquivos `.icloud` (placeholder de download)

## Como mover (passo a passo)

### Passo 1 — Fechar tudo
- Fechar Cursor
- Fechar VS Code
- Fechar terminal aberto na pasta antiga

### Passo 2 — Criar pasta destino (se não existir)
```powershell
New-Item -ItemType Directory -Path "C:\dev" -Force
```

### Passo 3 — Mover (ou clonar do zero, mais limpo)

**Opção A — Mover a pasta inteira (rápido, mas leva node_modules junto)**
```powershell
Move-Item "C:\Users\gabri\iCloudDrive\<caminho-atual>\Sistema-Financeiro-Geral" "C:\dev\"
```

**Opção B — Clonar do zero (mais limpo, recomendado)**
```powershell
cd C:\dev
git clone https://github.com/gabriellnovak2-max/Sistema-Financeiro-Geral.git
cd Sistema-Financeiro-Geral
npm install
```

### Passo 4 — Reabrir no Cursor
- Abre Cursor
- File → Open Folder → `C:\dev\Sistema-Financeiro-Geral`
- Confirma que `git status` tá limpo

### Passo 5 — Apagar a versão antiga do iCloud (DEPOIS de confirmar que a nova funciona)
```powershell
Remove-Item "C:\Users\gabri\iCloudDrive\<caminho-antigo>\Sistema-Financeiro-Geral" -Recurse -Force
```

## Exemplo do dia-a-dia

É igual estoque de café. Você não deixa saca de café cru no quintal exposto à chuva (iCloud). Coloca no galpão coberto, seco, com prateleira (`C:\dev`). O café é o mesmo, mas o lugar muda tudo na hora de torrar.
