# setup-pc.ps1
# Instala todas as ferramentas necessárias pro Sistema-Financeiro-Geral em PC Windows novo.
# Uso: abrir PowerShell como ADMIN e rodar `.\scripts\setup-pc.ps1`

Write-Host "🚀 Setup PC Gabriel — Sistema-Financeiro-Geral" -ForegroundColor Cyan
Write-Host ""

# Cria pasta C:\dev\ se não existir (local oficial dos projetos, fora do iCloud)
if (-not (Test-Path "C:\dev")) {
    Write-Host "📁 Criando C:\dev (pasta oficial dos projetos, fora do iCloud)..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "C:\dev" -Force | Out-Null
    Write-Host "  ✅ C:\dev criada" -ForegroundColor Green
} else {
    Write-Host "📁 C:\dev já existe" -ForegroundColor Gray
}
Write-Host ""

# Verifica se tá rodando como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Esse script precisa rodar como ADMIN. Fecha e abre PowerShell com botão direito → 'Executar como Administrador'." -ForegroundColor Red
    exit 1
}

# Lista de ferramentas via winget
$tools = @(
    @{ Name = "Git";              Id = "Git.Git" },
    @{ Name = "Node.js LTS";      Id = "OpenJS.NodeJS.LTS" },
    @{ Name = "PowerShell 7";     Id = "Microsoft.PowerShell" },
    @{ Name = "GitHub CLI";       Id = "GitHub.cli" },
    @{ Name = "Cursor IDE";       Id = "Anysphere.Cursor" },
    @{ Name = "7-Zip";            Id = "7zip.7zip" },
    @{ Name = "Insomnia";         Id = "Insomnia.Insomnia" }
)

Write-Host "📦 Instalando ferramentas via winget..." -ForegroundColor Yellow
foreach ($tool in $tools) {
    Write-Host "  → $($tool.Name)..." -NoNewline
    $result = winget install --id $tool.Id --silent --accept-source-agreements --accept-package-agreements 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } elseif ($result -match "already installed") {
        Write-Host " já instalado" -ForegroundColor Gray
    } else {
        Write-Host " ❌ erro" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📦 Atualizando PATH da sessão atual..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

Write-Host ""
Write-Host "📦 Instalando ferramentas via npm..." -ForegroundColor Yellow

# npm global NÃO instala Supabase CLI no Windows (não é suportado oficialmente).
# Supabase tem que vir via Scoop. Instala Scoop PRIMEIRO.
Write-Host "📦 Instalando Scoop (necessário pro Supabase CLI no Windows)..." -ForegroundColor Yellow
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
} else {
    Write-Host "  Scoop já instalado." -ForegroundColor Gray
}

Write-Host ""
Write-Host "📦 Instalando Supabase CLI via Scoop..." -ForegroundColor Yellow
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git 2>&1 | Out-Null
scoop install supabase

Write-Host ""
Write-Host "📦 Instalando ferramentas via npm (sem Supabase)..." -ForegroundColor Yellow
$npmTools = @("typescript", "tsx", "pnpm", "vercel", "@railway/cli", "memoir-cli")
foreach ($pkg in $npmTools) {
    Write-Host "  → $pkg..." -NoNewline
    npm install -g $pkg --silent 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Setup concluído, Visionário!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Reinicia o PowerShell pra carregar PATH novo"
Write-Host "  2. Roda: gh auth login"
Write-Host "  3. Roda: vercel login"
Write-Host "  4. Roda: railway login"
Write-Host "  5. Roda: supabase login"
Write-Host "  6. Roda: memoir login (e depois 'memoir pull' pra restaurar configs)"
Write-Host "  7. Abre Cursor e loga com sua conta"
Write-Host ""
Write-Host "Inventário completo: docs/cerebro-portatil/inventario-completo-programas.md" -ForegroundColor Gray
