# CONTEXTO E OBJETIVO

## Quem e o dono
Gabriel, dono da Patrocinio Cafe.

## Meta do sistema
Criar um ERP financeiro/fiscal/estoque/producao com alto nivel de automacao, sem pular etapa e sem quebrar estabilidade.

## Premissas que nao podem ser esquecidas
- Melhorar com IA/agentes onde fizer sentido.
- 100% automatico nao existe em area fiscal: precisa trilha de auditoria e pontos de aprovacao humana.
- Seguranca vem antes de feature nova.
- Codigo real vale mais do que plano bonito.

## Stack real atual (base de verdade)
- Frontend: `client/src` (React + Vite)
- HTTP client principal: `client/src/lib/queryClient.ts`
- Backend: `server/index.ts`, `server/routes.ts`, `server/storage.ts`
- Banco: Supabase

## Decisao arquitetural atual
Usar backend Express como ponto central de API para autenticacao, validacao, logs e regras de negocio.
