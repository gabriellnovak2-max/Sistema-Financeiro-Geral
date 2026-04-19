# Resumo da Conversa no Claude Code — Sistema Financeiro Geral
**Data: 19/04/2026**

---

## Contexto Geral

O usuário possui um app chamado **Sistema Financeiro Geral** (antes chamado "App Controle de Saída de Vendas Valtinho"). O app foi criado originalmente na **Perplexity AI** e controla vendas de café (marcas FireH, Transparente, Moído na Hora, etc).

O repositório no GitHub é: `gabriellnovak2-max/Sistema-Financeiro-Geral` (antigo `App-Controle-de-sa-da-de-vendas-`)

---

## Situação Atual do Projeto

### Estrutura de pastas (resultado do ls -la):
```
client/          → Frontend React + Vite + TailwindCSS
server/          → Backend Express + SQLite (better-sqlite3)
shared/          → Schema compartilhado (Drizzle ORM + Zod)
package.json     → Dependências do projeto
vite.config.ts   → Configuração do Vite
tsconfig.json    → Configuração TypeScript
```

### Stack Tecnológica:
- **Frontend**: React 18, Vite 7, TailwindCSS 3, Radix UI, Recharts, Wouter (rotas)
- **Backend**: Express 5, SQLite via better-sqlite3, Drizzle ORM
- **Validação**: Zod + drizzle-zod
- **Banco de dados**: SQLite local (arquivo `valtim.db`)

### Páginas do App:
- Dashboard (visão geral)
- Vendas (registrar/editar vendas)
- Clientes (cadastro)
- Calendário
- Relatórios
- Metas
- Produtos
- Configurações

### Schema do Banco de Dados (shared/schema.ts):

**Tabela `clientes`:**
- id, nome, cpfCnpj, telefone, endereco

**Tabela `vendas`:**
- id, data, marca, tipoProduto, pesoPacote, quantidadeKg, precoKg, valorTotal
- formaPagamento (pix, dinheiro, cartao, boleto, pendente)
- statusPagamento (pago, pendente, parcial)
- clienteNome, clienteId, emitirNota, observacoes, parcelas

---

## O que foi feito no Claude Code

1. Conectamos ao GitHub (usuário: gabriellnovak2-max)
2. Extraímos o código-fonte do arquivo zip que estava no repo
3. Instalamos dependências (npm install)
4. Criamos a branch `claude/debug-sales-app-i579c` no GitHub
5. Sincronizamos a branch local com a remota

---

## Problema Principal

O app foi criado na Perplexity AI, que transcreveu dados de anotações manuscritas de um caderno de vendas de café. A Perplexity cometeu MUITOS erros na transcrição:

- **Nomes de marcas errados** (ex: "FireH" virou "JFull", "JFoff", etc)
- **Nomes de clientes errados** (ex: "Lucineide" virou "Lucimilde", "Junior" virou "Furian")
- **Valores absurdamente errados** (ex: R$ 52,00 virou R$ 5.200,00)
- **Quantidades em kg erradas**
- **Tipos de produto errados** (ex: "Moído na Hora" virou "Unido no Lucro")

### IMPORTANTE: Os dados antigos do seed (server/routes.ts) devem ser DESCARTADOS COMPLETAMENTE. O sistema deve ser tratado como se estivesse começando do zero.

---

## Estado do Deploy

- O app **NÃO está deployado** ainda (sem Vercel, sem link público)
- Está apenas no GitHub como código-fonte
- Precisa configurar deploy (Vercel sugerido) para ter link acessível

---

## Próximos Passos (a definir com o usuário)

1. O usuário vai fornecer dados CORRETOS e ATUALIZADOS para popular o sistema
2. Dados de cadastro de produtos, clientes e preços precisam ser refeitos
3. Possivelmente configurar deploy no Vercel para acesso via link
4. Corrigir qualquer bug no código do app

---

## Informações Técnicas para Referência

- **Repo GitHub**: gabriellnovak2-max/Sistema-Financeiro-Geral
- **Branch de trabalho**: claude/debug-sales-app-i579c
- **Branch principal**: main
- **Projeto está 100% carregado no Claude Code e pronto para edições**
