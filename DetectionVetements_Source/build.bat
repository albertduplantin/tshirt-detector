@echo off
echo ========================================
echo Compilation du programme de detection
echo ========================================

REM Vérifier si CMake est installé
where cmake >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: CMake n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer CMake depuis: https://cmake.org/download/
    pause
    exit /b 1
)

REM Vérifier si Visual Studio est installé
where cl >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Visual Studio n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Visual Studio Community (gratuit)
    echo Ou exécuter vcvarsall.bat depuis le Developer Command Prompt
    pause
    exit /b 1
)

REM Créer le répertoire de build
if not exist build mkdir build
cd build

REM Configurer avec CMake
echo Configuration avec CMake...
cmake .. -G "Visual Studio 16 2019" -A x64
if %errorlevel% neq 0 (
    echo ERREUR: Échec de la configuration CMake
    pause
    exit /b 1
)

REM Compiler
echo Compilation...
cmake --build . --config Release
if %errorlevel% neq 0 (
    echo ERREUR: Échec de la compilation
    pause
    exit /b 1
)

REM Copier l'exécutable
echo Copie de l'exécutable...
copy Release\detection_vetements.exe ..\detection_vetements.exe
if %errorlevel% neq 0 (
    echo ERREUR: Impossible de copier l'exécutable
    pause
    exit /b 1
)

cd ..

echo ========================================
echo Compilation terminée avec succès!
echo ========================================
echo L'exécutable est: detection_vetements.exe
echo.
echo Pour lancer le programme:
echo detection_vetements.exe
echo.
pause 