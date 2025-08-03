@echo off
echo ========================================
echo Creation du package portable
echo ========================================

REM Vérifier si l'exécutable existe
if not exist detection_vetements.exe (
    echo ERREUR: detection_vetements.exe non trouvé
    echo Veuillez d'abord compiler l'application avec build.bat
    pause
    exit /b 1
)

REM Créer le dossier portable
if exist DetectionVetements_Portable (
    echo Suppression de l'ancien package...
    rmdir /s /q DetectionVetements_Portable
)

echo Creation du package portable...
mkdir DetectionVetements_Portable

REM Copier l'exécutable principal
echo Copie de l'exécutable principal...
copy detection_vetements.exe DetectionVetements_Portable\

REM Copier les DLLs OpenCV (si elles existent)
if exist opencv_core*.dll (
    echo Copie des DLLs OpenCV...
    copy opencv_*.dll DetectionVetements_Portable\
)

REM Copier les DLLs Visual C++ Runtime
echo Copie des DLLs Visual C++ Runtime...
copy "C:\Windows\System32\msvcp140.dll" DetectionVetements_Portable\ 2>nul
copy "C:\Windows\System32\vcruntime140.dll" DetectionVetements_Portable\ 2>nul

REM Créer le README
echo Creation du README...
(
echo # Detection de Vetements - Version Portable
echo.
echo ## Utilisation:
echo 1. Double-cliquez sur detection_vetements.exe
echo 2. L'application s'ouvrira automatiquement
echo.
echo ## Controles:
echo - Q: Quitter
echo - S: Sauvegarder une image
echo - R: Redemarrer la detection
echo.
echo ## Note:
echo Cette version est 100%% portable - aucune installation requise!
echo.
echo ## Compatibilite:
echo - Windows 10/11 ^(64-bit^)
echo - Aucune installation requise
echo - Fonctionne sur cle USB
) > DetectionVetements_Portable\README.txt

REM Créer un script de lancement
echo Creation du script de lancement...
(
echo @echo off
echo echo ========================================
echo echo Detection de Vetements - Version Portable
echo echo ========================================
echo echo.
echo echo Lancement de l'application...
echo echo.
echo detection_vetements.exe
echo if %%errorlevel%% neq 0 ^(
echo     echo.
echo     echo ERREUR: Impossible de lancer l'application
echo     echo Verifiez que votre webcam est connectee
echo     echo.
echo     pause
echo ^)
) > DetectionVetements_Portable\Lancer_Application.bat

echo ========================================
echo Package portable cree avec succes!
echo ========================================
echo.
echo Le package se trouve dans: DetectionVetements_Portable\
echo.
echo Contenu du package:
dir DetectionVetements_Portable\
echo.
echo Pour utiliser l'application:
echo 1. Copiez le dossier DetectionVetements_Portable\
echo 2. Double-cliquez sur Lancer_Application.bat
echo 3. Ou directement sur detection_vetements.exe
echo.
pause 