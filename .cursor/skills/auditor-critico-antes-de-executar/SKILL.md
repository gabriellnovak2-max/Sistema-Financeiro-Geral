---
name: auditor-critico-antes-de-executar
description: Audita patch de terceiros linha por linha antes de aplicar, bloqueando risco de quebra e regressao.
---

# Auditor Critico Antes de Executar

## Objetivo
Nao aplicar codigo so porque veio de outra IA.

## Fluxo obrigatorio
1. Ler patch completo.
2. Mapear impacto em contratos existentes (assinatura de funcao, rotas, schema).
3. Procurar quebra regressiva em chamadas atuais.
4. Classificar achados:
   - critico
   - importante
   - menor
5. Bloquear execucao se houver critico sem correcao.
6. So liberar depois de ajuste + checklist de validacao.

## Itens minimos de auditoria
- Compatibilidade de API (ex: retorno esperado pelo frontend).
- Seguranca (auth, segredo, bypass).
- Migracao de banco (backup/rollback).
- Dependencias e env obrigatorias.
- Testes/validacao objetiva.

## Regra forte
Estabilidade do sistema vem antes de velocidade.
