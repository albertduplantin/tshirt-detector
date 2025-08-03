# Script PowerShell avec autorisations GitHub
param(
    [string]$GitHubToken = "",
    [string]$Repository = "albertduplantin/webcam"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "AUTOMATISATION GITHUB AVEC AUTORISATIONS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Vérifier si Git est installé
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERREUR: Git n'est pas installé" -ForegroundColor Red
    Write-Host "Veuillez installer Git depuis: https://git-scm.com/downloads" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier si GitHub CLI est installé
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "ERREUR: GitHub CLI n'est pas installé" -ForegroundColor Red
    Write-Host "Veuillez installer GitHub CLI depuis: https://cli.github.com/" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Demander le token si pas fourni
if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "Token GitHub requis pour l'automatisation..." -ForegroundColor Yellow
    Write-Host "Instructions pour créer un token :" -ForegroundColor Cyan
    Write-Host "1. Allez sur https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Cliquez sur 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. Sélectionnez les autorisations : repo, workflow" -ForegroundColor White
    Write-Host "4. Copiez le token généré" -ForegroundColor White
    Write-Host ""
    $GitHubToken = Read-Host "Collez votre token GitHub ici"
}

# Configurer l'authentification
Write-Host "Configuration de l'authentification GitHub..." -ForegroundColor Cyan
echo $GitHubToken | gh auth login --with-token

# Vérifier la connexion
Write-Host "Vérification de la connexion..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Impossible de se connecter à GitHub" -ForegroundColor Red
    Write-Host "Vérifiez votre token et les autorisations" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host "Connexion GitHub réussie!" -ForegroundColor Green

# Initialiser le repository Git
Write-Host "Initialisation du repository Git local..." -ForegroundColor Cyan
git init
git add .
git commit -m "Initial commit - Detection de vetements"

# Configurer le remote
Write-Host "Configuration du repository distant..." -ForegroundColor Cyan
git remote add origin "https://github.com/$Repository.git"

# Upload vers GitHub
Write-Host "Upload vers GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

# Lancer la compilation automatique
Write-Host "Lancement de la compilation automatique..." -ForegroundColor Cyan
gh workflow run "Build Detection Vetements.yml" --repo $Repository

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "AUTOMATISATION TERMINEE AVEC SUCCES!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Votre code a été uploadé sur GitHub." -ForegroundColor White
Write-Host "La compilation automatique est en cours..." -ForegroundColor White
Write-Host ""
Write-Host "Pour suivre la progression:" -ForegroundColor Yellow
Write-Host "1. Allez sur: https://github.com/$Repository/actions" -ForegroundColor White
Write-Host "2. Cliquez sur le workflow en cours" -ForegroundColor White
Write-Host "3. Attendez 5-10 minutes" -ForegroundColor White
Write-Host "4. Téléchargez l'artefact 'DetectionVetements_Portable'" -ForegroundColor White
Write-Host ""

# Ouvrir automatiquement le navigateur
Write-Host "Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "https://github.com/$Repository/actions"

Read-Host "Appuyez sur Entrée pour quitter" 