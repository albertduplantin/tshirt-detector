# Script PowerShell pour automatiser l'upload GitHub
Write-Host "========================================" -ForegroundColor Green
Write-Host "AUTOMATISATION UPLOAD GITHUB" -ForegroundColor Green
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

# Vérifier si l'utilisateur est connecté à GitHub
Write-Host "Vérification de la connexion GitHub..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Connexion à GitHub requise..." -ForegroundColor Yellow
    gh auth login
}

Write-Host "Initialisation du repository Git local..." -ForegroundColor Cyan
git init
git add .
git commit -m "Initial commit - Detection de vetements"

Write-Host ""
Write-Host "Configuration du repository distant..." -ForegroundColor Cyan
git remote add origin https://github.com/albertduplantin/webcam.git

Write-Host ""
Write-Host "Upload vers GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "Lancement de la compilation automatique..." -ForegroundColor Cyan
gh workflow run "Build Detection Vetements.yml"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "UPLOAD TERMINE AVEC SUCCES!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Votre code a été uploadé sur GitHub." -ForegroundColor White
Write-Host "La compilation automatique est en cours..." -ForegroundColor White
Write-Host ""
Write-Host "Pour suivre la progression:" -ForegroundColor Yellow
Write-Host "1. Allez sur: https://github.com/albertduplantin/webcam/actions" -ForegroundColor White
Write-Host "2. Cliquez sur le workflow en cours" -ForegroundColor White
Write-Host "3. Attendez 5-10 minutes" -ForegroundColor White
Write-Host "4. Téléchargez l'artefact 'DetectionVetements_Portable'" -ForegroundColor White
Write-Host ""

# Ouvrir automatiquement le navigateur
Write-Host "Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "https://github.com/albertduplantin/webcam/actions"

Read-Host "Appuyez sur Entrée pour quitter" 