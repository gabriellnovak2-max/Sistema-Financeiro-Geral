# Deploy do Backend + Frontend

## Arquitetura recomendada

- Backend Node/Express: Railway (principal) ou Render (alternativa)
- Frontend Vite (vitrine): Vercel
- Frontend chama API via `VITE_API_BASE_URL`

## 1) Deploy do backend no Railway (recomendado)

Pré-requisitos no repositório (ja configurado):
- `railway.toml` com `startCommand = "npm run start"`
- Server usando `process.env.PORT` com fallback (`server/index.ts`)

No painel da Railway:
1. Crie um novo projeto e conecte este repositório GitHub.
2. Confirme que o serviço usa o diretório raiz do projeto.
3. Em **Variables**, cadastre:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`
4. Faça o deploy e copie a URL publica gerada (exemplo: `https://sistema-financeiro-backend.up.railway.app`).
5. Teste: abra `https://SUA-URL/api/stats` e confirme retorno JSON.

## 2) Alternativa: deploy no Render

Se nao usar Railway:
1. Crie um **Web Service** no Render ligado ao mesmo repositório.
2. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
3. Em **Environment Variables**, cadastre:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`
4. Faça deploy e copie a URL publica (exemplo: `https://sistema-financeiro-backend.onrender.com`).
5. Teste: `https://SUA-URL/api/stats`.

## 3) Atualizar o frontend no Vercel

Depois que o backend estiver no ar:
1. No Vercel (projeto da vitrine), vá em **Settings > Environment Variables**.
2. Atualize/crie:
   - `VITE_API_BASE_URL=https://URL-DO-BACKEND-EM-PRODUCAO`
3. Faça **Redeploy** do projeto no Vercel.

## 4) Atualizar ambiente local

No `.env` local, ajuste:
- `VITE_API_BASE_URL=https://URL-DO-BACKEND-EM-PRODUCAO`

## 5) Validacao de producao

Checklist:
- Backend responde `GET /api/stats` com status 200.
- Vitrine abre em `https://SEU-PROJETO.vercel.app/#/`.
- Telas que consomem API (Dashboard, Vendas, Clientes, Relatorios) carregam sem erro de rede.
- Sem erro de CORS no console do navegador.
