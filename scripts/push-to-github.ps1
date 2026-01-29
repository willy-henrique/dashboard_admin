# ============================================================
# SUBIR ALTERACOES PRO GITHUB
# ============================================================
# Rode FORA do Cursor:
#   1. Feche o Cursor (para liberar o .git/index.lock)
#   2. Abra PowerShell como Admin ou normal
#   3. cd c:\willydev\dashboard_admin
#   4. .\scripts\push-to-github.ps1
# ============================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "`n>>> Removendo index.lock..." -ForegroundColor Yellow
if (Test-Path .git\index.lock) {
    Remove-Item -Force .git\index.lock
    Write-Host "    Removido." -ForegroundColor Green
} else {
    Write-Host "    Nao existia." -ForegroundColor Gray
}

# Proxy apontando para 127.0.0.1:9 quebra o push
Write-Host "`n>>> Verificando proxy do Git..." -ForegroundColor Yellow
$hp = git config --global --get http.proxy 2>$null
$hsp = git config --global --get https.proxy 2>$null
if ($hp -or $hsp) {
    Write-Host "    Removendo proxy (http.proxy / https.proxy)..." -ForegroundColor Cyan
    git config --global --unset http.proxy 2>$null
    git config --global --unset https.proxy 2>$null
    Write-Host "    Proxy removido." -ForegroundColor Green
} else {
    Write-Host "    Nenhum proxy configurado." -ForegroundColor Gray
}

Write-Host "`n>>> Adicionando arquivos..." -ForegroundColor Cyan
git add lib/client-session-encryption.ts components/master/master-dashboard.tsx env.example env.local.example hooks/use-master-auth.ts

Write-Host ">>> Commit..." -ForegroundColor Cyan
git commit -m "feat(master): login obrigatorio, criptografia de sessao e modais com fundo branco"

Write-Host ">>> Push para GitHub..." -ForegroundColor Cyan
git push

Write-Host "`n*** Concluido! ***`n" -ForegroundColor Green
