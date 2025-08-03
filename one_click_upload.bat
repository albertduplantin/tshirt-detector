@echo off
echo ========================================
echo UPLOAD GITHUB EN UN CLIC
echo ========================================
echo.

REM Vérifier si Git est installé
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Git n'est pas installé
    echo Téléchargez depuis: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Vérifier si GitHub CLI est installé
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: GitHub CLI n'est pas installé
    echo Téléchargez depuis: https://cli.github.com/
    pause
    exit /b 1
)

echo.
echo ========================================
echo ETAPE 1: TOKEN GITHUB
echo ========================================
echo.
echo Pour créer un token GitHub:
echo 1. Allez sur: https://github.com/settings/tokens
echo 2. Cliquez sur "Generate new token (classic)"
echo 3. Note: DetectionVetements-Automation
echo 4. Expiration: 90 days
echo 5. Autorisations: repo, workflow, write:packages
echo 6. Copiez le token généré
echo.
set /p TOKEN="Collez votre token GitHub ici: "

echo.
echo ========================================
echo ETAPE 2: CONNEXION GITHUB
echo ========================================
echo %TOKEN% | gh auth login --with-token

echo.
echo ========================================
echo ETAPE 3: UPLOAD DU CODE
echo ========================================
git init
git add .
git commit -m "Initial commit - Detection de vetements"
git remote add origin https://github.com/albertduplantin/webcam.git
git branch -M main
git push -u origin main

echo.
echo ========================================
echo ETAPE 4: LANCEMENT COMPILATION
echo ========================================
gh workflow run "Build Detection Vetements.yml" --repo albertduplantin/webcam

echo.
echo ========================================
echo SUCCES! TOUT EST TERMINE
echo ========================================
echo.
echo Votre code a été uploadé et la compilation est lancée!
echo.
echo Pour récupérer votre version portable:
echo 1. Allez sur: https://github.com/albertduplantin/webcam/actions
echo 2. Attendez 5-10 minutes
echo 3. Téléchargez l'artefact "DetectionVetements_Portable"
echo.
echo Ouverture automatique du navigateur...
start https://github.com/albertduplantin/webcam/actions

echo.
echo Token supprimé de la mémoire pour la sécurité.
set TOKEN=

pause 