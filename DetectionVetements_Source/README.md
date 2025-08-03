# Détection de Vêtements - Application C++ Portable

## Description
Application C++ portable pour détecter automatiquement si vous portez un t-shirt ou un autre vêtement via votre webcam.

## Fonctionnalités
- ✅ Détection en temps réel via webcam
- ✅ Classification automatique des vêtements (t-shirt, pull, chemise, etc.)
- ✅ Interface graphique simple et intuitive
- ✅ Sauvegarde d'images
- ✅ Application portable (aucune installation requise)

## Prérequis
Pour compiler l'application, vous aurez besoin de :
1. **Visual Studio 2019/2022** (Community Edition gratuite)
2. **CMake** (version 3.16 ou supérieure)
3. **OpenCV** (sera téléchargé automatiquement)

## Installation et Compilation

### Option 1 : Compilation automatique (Recommandée)
1. Ouvrez un **Developer Command Prompt** de Visual Studio
2. Naviguez vers le dossier du projet
3. Exécutez le script de compilation :
   ```batch
   build.bat
   ```

### Option 2 : Compilation manuelle
1. Créez un dossier `build` :
   ```batch
   mkdir build
   cd build
   ```

2. Configurez avec CMake :
   ```batch
   cmake .. -G "Visual Studio 16 2019" -A x64
   ```

3. Compilez :
   ```batch
   cmake --build . --config Release
   ```

4. Copiez l'exécutable :
   ```batch
   copy Release\detection_vetements.exe ..\detection_vetements.exe
   ```

## Utilisation

### Lancement
```batch
detection_vetements.exe
```

### Contrôles
- **Q** : Quitter l'application
- **S** : Sauvegarder une capture d'écran
- **R** : Redémarrer la détection

### Interface
- **Cadre vert** : Zone de détection
- **Texte vert** : T-shirt détecté
- **Texte rouge** : Autre vêtement détecté
- **Instructions** : Affichées en bas de l'écran

## Algorithme de Détection

L'application utilise un algorithme basé sur :
1. **Analyse des couleurs HSV** pour détecter les zones de peau et de vêtements
2. **Détection de contours** pour identifier les formes
3. **Analyse des ratios** pour classifier les types de vêtements
4. **Filtrage intelligent** pour éliminer les faux positifs

## Structure du Projet
```
Webcam/
├── main.cpp              # Code source principal
├── CMakeLists.txt        # Configuration CMake
├── build.bat            # Script de compilation
├── requirements.txt      # Dépendances (pour référence)
└── README.md            # Ce fichier
```

## Dépannage

### Erreur : "Impossible d'ouvrir la webcam"
- Vérifiez que votre webcam est connectée et fonctionne
- Fermez les autres applications qui utilisent la webcam
- Redémarrez l'application

### Erreur : "Modèle non trouvé"
- L'application fonctionne en mode basique sans modèle pré-entraîné
- La détection se base sur l'analyse des couleurs et des formes

### Performance lente
- Fermez les autres applications gourmandes en ressources
- Assurez-vous d'avoir suffisamment de RAM disponible
- L'application est optimisée pour 30 FPS

## Version Portable

L'application est conçue pour être **100% portable** :
- ✅ Aucune installation requise
- ✅ Fonctionne sur n'importe quel PC Windows
- ✅ Pas de dépendances externes après compilation
- ✅ Peut être copiée sur une clé USB

## Support

Pour toute question ou problème :
1. Vérifiez que tous les prérequis sont installés
2. Consultez la section dépannage
3. Assurez-vous d'utiliser un Developer Command Prompt

## Licence
Ce projet est fourni à des fins éducatives et personnelles.

---
**Version** : 1.0  
**Dernière mise à jour** : 2024  
**Auteur** : Assistant IA 