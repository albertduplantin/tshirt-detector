@echo off
echo ========================================
echo Installation automatique d'OpenCV
echo ========================================

REM Créer le dossier pour OpenCV
if not exist opencv mkdir opencv
cd opencv

echo Téléchargement d'OpenCV...
echo Veuillez patienter...

REM Télécharger OpenCV (version portable)
powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/opencv/opencv/releases/download/4.8.0/opencv-4.8.0-windows.exe' -OutFile 'opencv-installer.exe'}"

if %errorlevel% neq 0 (
    echo ERREUR: Impossible de télécharger OpenCV
    echo Veuillez télécharger manuellement depuis:
    echo https://opencv.org/releases/
    pause
    exit /b 1
)

echo Extraction d'OpenCV...
opencv-installer.exe -o. -y

if %errorlevel% neq 0 (
    echo ERREUR: Impossible d'extraire OpenCV
    pause
    exit /b 1
)

REM Nettoyer
del opencv-installer.exe

echo ========================================
echo OpenCV installé avec succès!
echo ========================================
echo Vous pouvez maintenant compiler l'application.
echo.
pause

cd .. 