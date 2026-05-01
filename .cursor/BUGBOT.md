# .cursor/BUGBOT.md — Regras de Revisão do Sistema-Financeiro-Geral

> **Auditoria forense feita pela Perplexity em 01/05/2026** com base em todo histórico de chat + git log do repo `gabriellnovak2-max/Sistema-Financeiro-Geral` (50+ commits analisados).
> Cada regra abaixo nasceu de uma **cicatriz real** desse projeto. Não tem regra genérica, não tem perfume.

---

## Contexto do Projeto

**Sistema-Financeiro-Geral** é o ERP próprio da **Patrocínio Café**, torrefação private label em Goiânia-GO (~25.000 kg/mês). Dono: Judson Gabriell Martins (Gabriel/Visionário), perfil não-técnico, depende de orientação clique-por-clique.

**Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + wouter no frontend; Express 5 + TypeScript + Drizzle ORM + Zod (`jose` pra JWT ES256) no backend; Supabase Postgres (project `ekmjyubgknfssoqafxri`) com 5 tabelas (`clientes`, `vendas`, `contas_pagar`, `contas_receber`, `lancamentos`), RLS ligado nas 5 com policy `authenticated_all_*` e 11 índices `idx_*`. Deploy: Vercel (frontend) + Railway (backend Express). Repo: branch `main`.

**Fase atual:** Fase 1 — Blindagem (em execução). Concluídas: 1.1, 1.2, 1.3, 1.4, 1.5, 1.9, 1.10. Adiadas: 1.6, 1.7, 1.8. **Bloqueador atual: Railway em 502 por build quebrado** (`BUILDPACKS_PATH` indefinido + `SUPABASE_SERVICE_ROLE_KEY` declarada como ARG no build context). **Ordem Sagrada:** Architecture → Blindagem → Financeiro → OP → Fiscal → IA → BI → Mobile. **n8n só Fase 5.**

---

## Categoria 1 — 🛡️ Segurança

### Regra 1.1 — Toda rota `/api/*` nova precisa de `requireAuth`
- **O que conferir:** PR que adiciona `app.get|post|patch|delete('/api/...')` em `server/routes.ts` ou `server/index.ts` sem usar `requireAuth` como middleware.
- **Por que existe (caso real):** Antes do commit `ee9f192` (`feat(seguranca): middleware JWT ES256`), a rota `/api/vendas` estava aberta em produção retornando lista de clientes sem token. Vazamento real de dados.
- **Como Bugbot detecta:** regex `app\.(get|post|patch|put|delete)\(['"]\/api\/` sem `requireAuth` na mesma chamada.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** posto de gasolina sem cancela na entrada — qualquer carro entra, abastece, vai embora sem pagar.

### Regra 1.2 — Proibido commitar `.env`, `service_role`, `sb_secret_`, JWT em diff
- **O que conferir:** diff do PR contendo qualquer um dos padrões: arquivo `.env*` (exceto `.env.example`), strings começando com `sb_secret_`, `service_role`, `eyJhbGciOi` (header de JWT), `SUPABASE_SERVICE_ROLE_KEY=ey...`.
- **Por que existe:** o próprio Railway acabou de jogar warning `SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "SUPABASE_SERVICE_ROLE_KEY")` no build de 01/05/2026.
- **Como Bugbot detecta:** scan de diff por regex de chaves Supabase + lista de arquivos proibidos.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** padaria que cola a senha do cofre num post-it na vitrine. Qualquer um que passa na rua tira foto e volta de noite.

### Regra 1.3 — Proibido `eval`, `new Function()`, `child_process.exec` direto
- **O que conferir:** uso de `eval(`, `new Function(`, `exec(` (sem `execFile` ou shell quoting) em qualquer arquivo `.ts`/`.tsx`.
- **Por que existe:** vetor de RCE clássico. Bugbot precisa bloquear preventivamente já que o backend Express vai expor mais rotas na Fase 2.
- **Como Bugbot detecta:** AST scan + regex.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** mercado que aceita freguês escrevendo na máquina registradora qualquer comando que ele quiser. Em 5 min some o caixa.

### Regra 1.4 — Mexer em `server/middleware/requireAuth.ts` exige nota no PR
- **O que conferir:** PR que toca o arquivo sem descrição explicando o que mudou e qual rota foi testada.
- **Por que existe:** middleware é o único portão de entrada. Bug aqui = todas as rotas caem.
- **Como Bugbot detecta:** path `server/middleware/requireAuth.ts` no diff sem descrição mínima de 50 caracteres + sem menção a `curl` ou teste.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** mexer na fechadura do cofre do banco sem chamar 2 testemunhas — depois ninguém sabe quem deixou aberto.

### Regra 1.5 — `throw` no top-level de módulo precisa de fallback gracioso
- **O que conferir:** `throw new Error(...)` fora de função, no escopo de módulo (igual `requireAuth.ts:7` e `storage.ts:8`).
- **Por que existe:** **causa raiz do Railway 502 atual.** Quando falta env, o `import` dispara throw → processo morre antes de abrir porta → 502 silencioso. Custou 3 dias de investigação.
- **Como Bugbot detecta:** AST: `throw` em statement de top-level (não dentro de function/method).
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** padeiro que se mata se faltar fermento. A padaria não abre nem pra vender água. Melhor avisar "sem pão hoje" e abrir mesmo assim.

### Regra 1.6 — `cors` precisa whitelist explícita, nunca `origin: '*'`
- **O que conferir:** `cors({ origin: '*' })` ou `cors()` sem config em `server/index.ts`.
- **Por que existe:** commit `5763de4 fix(cors): liberar dominio vercel.app` mostrou que CORS já foi mexido na pressa. Liberar `*` na pressa de novo abre brecha.
- **Como Bugbot detecta:** regex `cors\(\s*\)` ou `origin:\s*['"]\*['"]`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** lavanderia que aceita qualquer um buscando qualquer roupa sem ticket. Some camisa toda semana.

---

## Categoria 2 — 🐛 Bug Funcional

### Regra 2.1 — Endpoint POST/PATCH novo precisa validar com Zod
- **O que conferir:** rota `app.post|patch` que chama `req.body` direto sem passar por `.parse()` ou `.safeParse()` de schema Zod.
- **Por que existe:** commit `0b27375 feat(seguranca): validação Zod nos endpoints PATCH` foi exatamente pra arrumar PATCH que aceitava body livre. Antes disso, dava pra mandar `{ valor: "asdf" }` e quebrar contas a pagar.
- **Como Bugbot detecta:** rota com `req.body` sem `.parse(` ou `.safeParse(` no mesmo handler.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** caixa de supermercado que aceita cliente digitando o preço do próprio produto. No fim do dia o caixa fecha negativo.

### Regra 2.2 — Campo obrigatório no schema precisa de mensagem amigável
- **O que conferir:** Zod schema com `.min(1)` ou `.nonempty()` sem `{ message: "..." }` em PT-BR.
- **Por que existe:** commit `11cac0b fix(vendas): avisar campos obrigatórios ao salvar` — Gabriel tava tomando erro genérico em inglês na tela de vendas.
- **Como Bugbot detecta:** regex `\.min\(1\)|\.nonempty\(\)` sem `message:` na mesma chamada.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** terminal de banco que mostra "Error 0x4F9A" em vez de "Falta CPF". Cliente não sabe o que faltou e sai do banco bravo.

### Regra 2.3 — Try/catch não pode engolir erro silencioso
- **O que conferir:** `catch (e) { /* nada */ }` ou `catch { return null }` sem `console.error` nem `logger.error` nem re-throw.
- **Por que existe:** padrão repetido — quando dá erro silencioso, Gabriel passa horas achando que é bug do front quando é do back.
- **Como Bugbot detecta:** AST: catch block sem chamada a console/logger/throw.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** mecânico que vê fumaça saindo do motor mas fecha o capô e diz "tá bom". Daí 2 dias depois o carro pega fogo na estrada.

---

## Categoria 3 — 🏗️ Arquitetura

### Regra 3.1 — Frontend não pode importar `@supabase/supabase-js` fora de `client/src/lib/supabase.ts`
- **O que conferir:** `import ... from '@supabase/supabase-js'` em arquivos `.tsx` ou em `lib/` que não seja `supabase.ts`.
- **Por que existe:** commit `93ef74e chore(limpeza): remover client/src/lib/db.ts (Drizzle legado)` — frontend tinha 2 caminhos de banco (db.ts + supabase.ts), gerava fluxo híbrido. Cursor identificou isso na auditoria de 22/04.
- **Como Bugbot detecta:** regex `@supabase/supabase-js` em arquivos sob `client/src/` exceto `client/src/lib/supabase.ts`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** loja com 2 caixas registradoras separadas no mesmo balcão. Vendedor cobra na A, troco volta da B, no fim do dia ninguém sabe quanto vendeu.

### Regra 3.2 — Frontend SEMPRE chama backend Railway, nunca Supabase direto pra dados de negócio
- **O que conferir:** componente `.tsx` que chama `supabase.from('clientes')` ou outras tabelas de negócio direto (Auth pode).
- **Por que existe:** Ordem Sagrada → Blindagem antes de Financeiro. Fluxo direto Front→Supabase pula middleware `requireAuth` e deixa RLS como única defesa. Commit `02cfd78 feat(seguranca): frontend envia JWT Bearer em todas requests` consolidou o fluxo correto via backend.
- **Como Bugbot detecta:** regex `supabase\.from\(['"](clientes|vendas|contas_pagar|contas_receber|lancamentos)['"]\)` em qualquer `.tsx`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** funcionário do mercado pegando produto direto do depósito sem passar pelo caixa. No fim do mês o estoque tá errado e ninguém sabe quem levou o quê.

---

## Categoria 4 — ⚙️ Build/Deploy

### Regra 4.1 — `tsx` e `typescript` em `dependencies`, nunca `devDependencies`
- **O que conferir:** PR que move `tsx` ou `typescript` de `dependencies` pra `devDependencies` em `package.json`.
- **Por que existe:** commit `a566f0f fix(railway): mover tsx/typescript pra dependencies pra build funcionar` resolveu **7 deploys falhados consecutivos no Railway**. Railway roda `npm install --omit=dev` em produção; sem `tsx` no `dependencies`, o `start` quebra.
- **Como Bugbot detecta:** comparar diff de `package.json`: se `tsx`/`typescript` saíram de `dependencies`, bloquear.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** padeiro que põe a chave do forno na chaveiro do uniforme da casa. Quando troca de roupa pra sair, deixa em casa. Forno fica trancado de manhã.

### Regra 4.2 — Scripts em `package.json` usam caminho absoluto `node node_modules/tsx/dist/cli.mjs`, nunca só `tsx`
- **O que conferir:** script `dev`/`build`/`start` com `"tsx server/index.ts"` direto em vez de `"node node_modules/tsx/dist/cli.mjs server/index.ts"`.
- **Por que existe:** commit `da0bb20 fix(railway): usar caminho absoluto do tsx em scripts dev/build`. Railway PATH não acha `tsx` global, só local. Tomei prejuízo de 1 deploy a mais por causa disso.
- **Como Bugbot detecta:** regex `"(dev|build|start)":\s*"[^"]*\btsx\s` (tsx isolado, não `node ... tsx/dist`).
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** açougueiro que pede "a faca grande" sem dizer onde tá. Cada ajudante traz uma faca diferente, enrola a venda toda.

### Regra 4.3 — Variáveis sensíveis NUNCA podem ser declaradas como `ARG` em `Dockerfile` ou `nixpacks.toml`
- **O que conferir:** `ARG SUPABASE_SERVICE_ROLE_KEY`, `ARG SUPABASE_URL`, ou qualquer ARG com nome contendo `KEY|SECRET|TOKEN|PASSWORD`.
- **Por que existe:** **bug ativo agora (01/05/2026)** — Build Log Railway: `SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "SUPABASE_SERVICE_ROLE_KEY")`. Variável tem que ser **runtime only**, injetada pelo painel Railway na hora de rodar — não no build.
- **Como Bugbot detecta:** regex `ARG\s+(\w*(?:KEY|SECRET|TOKEN|PASSWORD|URL)\w*)` em `Dockerfile`, `nixpacks.toml`, `railway.toml`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** banco que escreve a senha do cofre no manual de instruções do cofre. Toda vez que vem técnico arrumar a porta, ele lê a senha sem querer.

### Regra 4.4 — Toda variável de ambiente referenciada em build precisa estar definida ou ter default
- **O que conferir:** uso de `$VARIAVEL` em `Dockerfile`/`nixpacks.toml`/`railway.toml` sem `ENV VARIAVEL=...` antes ou sem fallback `${VARIAVEL:-default}`.
- **Por que existe:** outro warning ativo no Build Log: `UndefinedVar: Usage of undefined variable '$BUILDPACKS_PATH' (line 14)`. Build quebra silenciosamente.
- **Como Bugbot detecta:** parser de Dockerfile que valida toda referência `$VAR` contra `ENV` declarados ou env de runtime conhecido.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** receita de bolo que diz "põe a quantidade certa de açúcar". Cada pessoa coloca um tanto, sai bolo diferente toda vez.

### Regra 4.5 — `railway.toml` não pode declarar `PORT` fixa
- **O que conferir:** `PORT = 3000` ou similar em `railway.toml` ou `nixpacks.toml`.
- **Por que existe:** Railway injeta `PORT` automaticamente. Hardcoded brigam com a porta dinâmica e dão `Application failed to respond`.
- **Como Bugbot detecta:** regex `PORT\s*=\s*\d+` em arquivos `*.toml`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** ônibus que insiste em parar sempre na mesma vaga, mas a vaga já tá ocupada. Ele dá meia volta e some.

---

## Categoria 5 — 📦 Dependência

### Regra 5.1 — `VITE_SUPABASE_ANON_KEY` precisa fallback pra `VITE_SUPABASE_PUBLISHABLE_KEY`
- **O que conferir:** uso de `VITE_SUPABASE_ANON_KEY` sem `||` apontando pra `VITE_SUPABASE_PUBLISHABLE_KEY`.
- **Por que existe:** commit `00124ad feat(seguranca): migrar ANON_KEY para PUBLISHABLE_KEY com fallback`. Supabase tá deprecando `anon` em favor de `publishable`. Sem fallback, app quebra quando Supabase desligar definitivo.
- **Como Bugbot detecta:** regex `VITE_SUPABASE_ANON_KEY` sem `||\s*.*PUBLISHABLE_KEY` no mesmo statement.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** loja que só aceita boleto antigo. Quando o banco trocar o sistema, a loja fica sem receber.

### Regra 5.2 — Não pode instalar pacote global no Windows (`npm install -g`)
- **O que conferir:** doc/script que instrui `npm install -g supabase` ou similar.
- **Por que existe:** Supabase CLI não suporta install global no Windows. Sessão inteira perdida tentando instalar.
- **Como Bugbot detecta:** regex `npm install -g\s+(supabase|...)` em `.md`/`.ps1`/`.sh`.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** receita que manda colocar fermento biológico no microondas. Não funciona, não vai funcionar, perde a massa toda.

### Regra 5.3 — Versão do Node em scripts precisa ser compatível com Railway (>=20)
- **O que conferir:** `engines.node` em `package.json` ou shebang com Node <20.
- **Por que existe:** discordância entre Node 22 (Cursor) e Node 24 (Gabriel local) já causou build divergente. Railway usa Nixpacks Node 20 default.
- **Como Bugbot detecta:** parse de `package.json` `engines.node` e shebangs `.js`.
- **Severidade:** 🟢 SUGESTÃO
- **Exemplo dia-a-dia:** receita que pede forno a 200°C, mas cada cozinha tem termostato calibrado diferente. Bolo queima ou cru.

---

## Categoria 6 — 📊 Dados

### Regra 6.1 — Campo de data no Drizzle precisa ser `timestamp()`/`timestamptz()`, nunca `text()`
- **O que conferir:** `pgTable` com coluna chamada `data`, `criado_em`, `updated_at`, `vencimento`, `pagamento` declarada como `text()`.
- **Por que existe:** commit `2e9be33 fix(schema): vendas.data como timestamp (schema estava text, banco já era timestamp)`. Schema mentiu pro front por semanas — banco tava certo, código TypeScript tava achando que era string. Bugs de ordenação e filtro.
- **Como Bugbot detecta:** regex em `shared/schema.ts`: coluna com nome contendo `data|date|criado|updated|vencimento|pagamento` declarada como `text(`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** caderno de produção que anota data de torra como "ontem", "anteontem". Daqui 1 mês ninguém sabe que dia foi cada lote.

### Regra 6.2 — `pgTable` novo precisa ter migration de RLS na sequência
- **O que conferir:** PR que adiciona `pgTable` em `shared/schema.ts` mas não adiciona migration `supabase/migrations/*_rls_*.sql` no mesmo PR.
- **Por que existe:** commit `c2be5c0 security: ligar RLS nas 5 tabelas + politica authenticated-only` foi feito DEPOIS de já ter dados em produção. Tabela sem RLS por 1 dia = janela de vazamento.
- **Como Bugbot detecta:** diff em `shared/schema.ts` adicionando `pgTable` sem arquivo `.sql` em `supabase/migrations/` no mesmo PR contendo `ENABLE ROW LEVEL SECURITY`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** abrir loja nova sem trancar a porta. Pode ser 2 horas, pode ser 2 dias — em algum momento entra alguém.

### Regra 6.3 — Migration nova precisa ter nota explicando intenção e impacto
- **O que conferir:** arquivo `supabase/migrations/*.sql` adicionado sem comentário `-- Intenção:` ou sem descrição de PR de pelo menos 100 caracteres.
- **Por que existe:** Gabriel não é técnico — sem nota, ele não sabe o que está sendo aplicado no banco dele.
- **Como Bugbot detecta:** arquivo novo em `supabase/migrations/` sem `--` no início + sem corpo de PR mínimo.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** pedreiro que muda planta da casa sem avisar o dono. Quando o dono volta, descobre que tiraram uma parede importante.

---

## Categoria 7 — 🔄 Processo

### Regra 7.1 — PR não pode ter base muito antiga (>= 5 commits atrás de `main`)
- **O que conferir:** branch do PR que está mais de 5 commits atrás do HEAD de `main`.
- **Por que existe:** **REGRA ZERO da skill `duo-perplexity-cursor`** — Perplexity, Cursor e Claude Code mexem no mesmo repo. Pull antes de começar é sagrado. Já teve confusão de uma sessão inteira com merge `claude/debug-sales-app-i579c` por causa disso.
- **Como Bugbot detecta:** GitHub API `compare base...head` retornando `behind_by >= 5`.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** 3 funcionários da torrefação anotando produção em cadernos diferentes do mesmo dia. No fim do mês ninguém bate o estoque.

### Regra 7.2 — Repositório não pode ficar dentro de pasta sincronizada (iCloud, OneDrive, Dropbox)
- **O que conferir:** doc/setup que aponta caminho de clone dentro de `~/Library/Mobile Documents`, `OneDrive`, `Dropbox`.
- **Por que existe:** **bug crítico no início do projeto** — repo morava no iCloud, sync da Apple corrompeu `.git`, projeto quase foi do zero (Plano C de re-clone). Cicatriz #1 do Visionário.
- **Como Bugbot detecta:** scan de docs/scripts por padrões `iCloud Drive|Mobile Documents|OneDrive\\|Dropbox\\` apontando pra repo.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** guardar receita da padaria num caderno que a esposa também usa pra lista de mercado. Um rasura o do outro até ninguém entender mais nada.

### Regra 7.3 — Commit message tem que ser PT-BR + prefixo convencional
- **O que conferir:** mensagem sem `feat:|fix:|chore:|docs:|refactor:|security:|perf:` no começo, ou em inglês.
- **Por que existe:** padrão consolidado no histórico do repo (40+ commits seguindo o formato). Quebrar padrão atrapalha histórico.
- **Como Bugbot detecta:** regex no commit message; flag inglês com lista de palavras comuns (`add|update|fix|remove`).
- **Severidade:** 🟢 SUGESTÃO
- **Exemplo dia-a-dia:** atendente que atende uma hora em PT, outra em inglês com o mesmo cliente. O cliente acha que foram 2 atendentes diferentes.

### Regra 7.4 — Force push em `main` é proibido sem autorização explícita do Gabriel
- **O que conferir:** push com `--force` ou `--force-with-lease` em `main`.
- **Por que existe:** REGRA ZERO da skill — apaga trabalho dos outros 2 assistentes. Já foi avisado.
- **Como Bugbot detecta:** GitHub event `force_push` em branch protegida.
- **Severidade:** 🔴 OBRIGATÓRIA
- **Exemplo dia-a-dia:** funcionário que arranca a folha do livro caixa do dia anterior porque "tava errado". Sem evidência, sem rastro, sem prestação de conta.

---

## Categoria 8 — 🧠 Padrão de Código

### Regra 8.1 — Função async em handler Express precisa wrapper de erro
- **O que conferir:** `app.get|post('/...', async (req, res) => { ... })` sem try/catch ou sem usar `express-async-errors`.
- **Por que existe:** Express 5 já joga erro async pro middleware, mas `requireAuth` precisa ser primeiro. Padrão precisa ser uniforme.
- **Como Bugbot detecta:** AST: handler async sem try/catch e sem `next(error)`.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** garçom que leva o pedido errado e finge que não foi nada. Cliente fica esperando, mesa esquecida, gerente leva bronca depois.

### Regra 8.2 — Logs de erro precisam usar `console.error`, não `console.log`
- **O que conferir:** dentro de `catch` block, uso de `console.log` em vez de `console.error`.
- **Por que existe:** Railway separa stderr e stdout. Erro em stdout some no meio dos logs normais — Gabriel não acha o que quebrou.
- **Como Bugbot detecta:** AST: `console.log` dentro de catch block.
- **Severidade:** 🟢 SUGESTÃO
- **Exemplo dia-a-dia:** padaria que mistura nota fiscal com guardanapo usado na mesma lixeira. Quando a contabilidade pede, ninguém acha.

### Regra 8.3 — Componente React não pode chamar `fetch` direto, sempre via `queryClient` (TanStack Query)
- **O que conferir:** `fetch(` em arquivo `.tsx` fora de `client/src/lib/queryClient.ts`.
- **Por que existe:** padrão do projeto desde commit `1fef74c Migrar banco de SQLite para Supabase`. Sem queryClient → sem cache, sem retry, sem invalidation. Bugs de UI desatualizada.
- **Como Bugbot detecta:** regex `fetch\(` em arquivos `client/src/**/*.tsx` exceto `lib/queryClient.ts`.
- **Severidade:** 🟡 ALERTA
- **Exemplo dia-a-dia:** atendente que toda vez que cliente pergunta o preço, vai correndo no depósito conferir. Lentidão eterna, fila, cliente desiste.

---

## Regras de Severidade

- **🔴 OBRIGATÓRIA:** Bugbot **bloqueia merge**. Não passa sem corrigir. Risco de segurança, build quebrado, vazamento ou perda de dado.
- **🟡 ALERTA:** Bugbot **comenta no PR** mas merge passa. Risco médio, padrão importante mas não fatal.
- **🟢 SUGESTÃO:** Bugbot **deixa sugestão amigável**. Boa prática, polish, não trava nada.

---

## Apêndice — Histórico real que originou cada regra

| Data | Cicatriz | Custou | Regra que nasceu |
|------|----------|--------|------------------|
| Início | Repo dentro do iCloud → `.git` corrompido | Quase repo do zero, Plano C | 7.2 |
| Antes 22/04 | `tsx` em `devDependencies` | 7 deploys falhados Railway | 4.1 |
| Antes 22/04 | `tsx` chamado direto, sem caminho absoluto | +1 deploy falho | 4.2 |
| 22/04 | RLS desligado nas 5 tabelas | 1 dia de janela de vazamento | 6.2 |
| 22/04 | `client/src/lib/db.ts` vivo + `supabase.ts` (fluxo híbrido) | Auditoria Cursor pegou | 3.1 |
| 22/04 | Frontend Supabase direto (sem JWT no backend) | Vazamento real `/api/vendas` | 1.1, 3.2 |
| 22/04 | `vendas.data` como `text()` no Drizzle | Schema mentiu por semanas | 6.1 |
| 22/04 | PATCH sem Zod | Validação livre | 2.1 |
| Antes 30/04 | `npm install -g supabase` no Windows | Sessão inteira perdida | 5.2 |
| 30/04 | Token Railway de workspace ≠ user → `whoami` falhou | Sessão de confusão | 7.1 |
| 30/04 | Node 22 (Cursor) vs Node 24 (Gabriel) | Build divergente | 5.3 |
| 01/05 | `requireAuth.ts:7` + `storage.ts:8` `throw` no top-level | Railway 502 sem log | 1.5 |
| 01/05 | `BUILDPACKS_PATH` indefinido no Nixpacks | Build quebra silencioso | 4.4 |
| 01/05 | `SUPABASE_SERVICE_ROLE_KEY` como `ARG` em build | Warning de segredo + build falha | 1.2, 4.3 |
| 01/05 | 3 services Railway crashed em loop | Esperando arrumar build | 4.3, 4.4 |

---

**Fim do BUGBOT.md.** Toca o serviço, parceiro.
