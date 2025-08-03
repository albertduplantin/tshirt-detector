@echo off
echo ========================================
echo UPLOAD GITHUB SANS GITHUB CLI
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

echo Git trouvé avec succès!
echo.

echo ========================================
echo ETAPE 1: CONFIGURATION GIT
echo ========================================
echo.

REM Configurer Git avec les informations utilisateur
echo Configuration de Git...
git config --global user.name "albertduplantin"
git config --global user.email "albertduplantin@github.com"

echo.
echo ========================================
echo ETAPE 2: UPLOAD DU CODE
echo ========================================
echo.

REM Initialiser le repository Git
echo Initialisation du repository Git...
git init

REM Ajouter tous les fichiers
echo Ajout des fichiers...
git add .

REM Faire le premier commit
echo Création du premier commit...
git commit -m "Initial commit - Detection de vetements"

REM Configurer le remote
echo Configuration du repository distant...
git remote add origin https://github.com/albertduplantin/webcam.git

REM Changer la branche principale
echo Configuration de la branche principale...
git branch -M main

REM Upload vers GitHub
echo Upload vers GitHub...
echo.
echo ATTENTION: Si c'est la première fois, Git va vous demander vos identifiants GitHub
echo Utilisez votre nom d'utilisateur GitHub et votre token comme mot de passe
echo.
git push -u origin main

echo.
echo ========================================
echo SUCCES! CODE UPLOADE
echo ========================================
echo.
echo Votre code a été uploadé avec succès sur GitHub!
echo.
echo ========================================
echo ETAPE 3: LANCER LA COMPILATION
echo ========================================
echo.
echo Pour lancer la compilation automatique:
echo 1. Allez sur: https://github.com/albertduplantin/webcam
echo 2. Cliquez sur l'onglet "Actions"
echo 3. Cliquez sur "Build Detection Vetements"
echo 4. Cliquez sur "Run workflow"
echo 5. Cliquez sur "Run workflow" (bouton vert)
echo.
echo Ouverture automatique du repository...
start https://github.com/albertduplantin/webcam

echo.
echo ========================================
echo ETAPE 4: RECUPERER VOTRE VERSION
echo ========================================
echo.
echo Une fois la compilation terminée (5-10 minutes):
echo 1. Allez sur: https://github.com/albertduplantin/webcam/actions
echo 2. Cliquez sur le workflow terminé (bouton vert)
echo 3. Descendez jusqu'à "Artifacts"
echo 4. Cliquez sur "DetectionVetements_Portable" pour télécharger
echo 5. Extrayez le fichier ZIP
echo 6. Double-cliquez sur detection_vetements.exe
echo.

echo Ouverture automatique des Actions...
start https://github.com/albertduplantin/webcam/actions

echo.
echo ========================================
echo RESUME
echo ========================================
echo.
echo ✅ Code uploadé sur GitHub
echo ⏳ Compilation à lancer manuellement
echo 📦 Version portable disponible dans 5-10 minutes
echo.
echo Si vous avez des problèmes avec l'authentification:
echo 1. Créez un token GitHub: https://github.com/settings/tokens
echo 2. Utilisez votre nom d'utilisateur et le token comme mot de passe
echo.

pause 