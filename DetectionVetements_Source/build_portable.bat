@echo off
echo ========================================
echo COMPILATION ET CREATION DU PACKAGE PORTABLE
echo ========================================
echo.

echo Etape 1: Compilation de l'application...
call build.bat
if %errorlevel% neq 0 (
    echo ERREUR: Echec de la compilation
    pause
    exit /b 1
)

echo.
echo Etape 2: Creation du package portable...
call create_portable.bat
if %errorlevel% neq 0 (
    echo ERREUR: Echec de la creation du package
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCES! PACKAGE PORTABLE CREE
echo ========================================
echo.
echo Le package portable se trouve dans: DetectionVetements_Portable\
echo.
echo Pour utiliser l'application:
echo 1. Copiez le dossier DetectionVetements_Portable\
echo 2. Double-cliquez sur detection_vetements.exe
echo 3. Ou utilisez Lancer_Application.bat
echo.
echo L'application est maintenant 100%% portable!
echo Elle fonctionnera sur n'importe quel PC Windows sans installation.
echo.
pause 