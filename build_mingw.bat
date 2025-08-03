@echo off
echo ========================================
echo Compilation avec MinGW (plus léger)
echo ========================================

REM Vérifier si CMake est installé
where cmake >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: CMake n'est pas installé
    echo Téléchargez depuis: https://cmake.org/download/
    pause
    exit /b 1
)

REM Vérifier si MinGW est installé
where g++ >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: MinGW n'est pas installé
    echo Téléchargez depuis: https://www.mingw-w64.org/
    echo Ou installez via MSYS2: https://www.msys2.org/
    pause
    exit /b 1
)

REM Créer le répertoire de build
if not exist build_mingw mkdir build_mingw
cd build_mingw

REM Configurer avec CMake pour MinGW
echo Configuration avec CMake (MinGW)...
cmake .. -G "MinGW Makefiles"
if %errorlevel% neq 0 (
    echo ERREUR: Échec de la configuration CMake
    pause
    exit /b 1
)

REM Compiler
echo Compilation...
cmake --build .
if %errorlevel% neq 0 (
    echo ERREUR: Échec de la compilation
    pause
    exit /b 1
)

REM Copier l'exécutable
echo Copie de l'exécutable...
copy detection_vetements.exe ..\detection_vetements_mingw.exe
if %errorlevel% neq 0 (
    echo ERREUR: Impossible de copier l'exécutable
    pause
    exit /b 1
)

cd ..

echo ========================================
echo Compilation MinGW terminée avec succès!
echo ========================================
echo L'exécutable est: detection_vetements_mingw.exe
echo.
echo Pour lancer le programme:
echo detection_vetements_mingw.exe
echo.
pause 