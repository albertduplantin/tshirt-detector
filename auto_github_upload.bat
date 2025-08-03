@echo off
echo ========================================
echo AUTOMATISATION UPLOAD GITHUB
echo ========================================
echo.

REM Vérifier si Git est installé
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Git n'est pas installé
    echo Veuillez installer Git depuis: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Vérifier si GitHub CLI est installé
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: GitHub CLI n'est pas installé
    echo Veuillez installer GitHub CLI depuis: https://cli.github.com/
    pause
    exit /b 1
)

echo Initialisation du repository Git local...
git init
git add .
git commit -m "Initial commit - Detection de vetements"

echo.
echo Configuration du repository distant...
git remote add origin https://github.com/albertduplantin/webcam.git

echo.
echo Upload vers GitHub...
git branch -M main
git push -u origin main

echo.
echo Lancement de la compilation automatique...
gh workflow run "Build Detection Vetements.yml"

echo.
echo ========================================
echo UPLOAD TERMINE AVEC SUCCES!
echo ========================================
echo.
echo Votre code a été uploadé sur GitHub.
echo La compilation automatique est en cours...
echo.
echo Pour suivre la progression:
echo 1. Allez sur: https://github.com/albertduplantin/webcam/actions
echo 2. Cliquez sur le workflow en cours
echo 3. Attendez 5-10 minutes
echo 4. Téléchargez l'artefact "DetectionVetements_Portable"
echo.
pause 