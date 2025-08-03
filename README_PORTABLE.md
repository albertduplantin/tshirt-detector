# 🚀 Version Portable - Utilisation Directe

## ✅ **Solution la plus simple : Version pré-compilée**

Si vous ne voulez PAS installer Visual Studio ou MinGW, voici les options :

### **Option A : Télécharger l'exécutable pré-compilé**
1. Je peux compiler l'application sur mon système
2. Vous téléchargez directement l'exécutable + DLLs
3. **Aucune installation requise** - ça marche immédiatement !

### **Option B : Utiliser un service de compilation en ligne**
- **GitHub Actions** : Compilation automatique
- **AppVeyor** : Service de build gratuit
- **Travis CI** : Compilation dans le cloud

### **Option C : Demander à quelqu'un de compiler**
- Un ami avec Visual Studio
- Un collègue développeur
- Un service de compilation payant

## 📦 **Ce que vous recevrez (version portable) :**

```
DetectionVetements_Portable/
├── detection_vetements.exe    # L'application principale
├── opencv_core480.dll        # Bibliothèques OpenCV
├── opencv_imgproc480.dll
├── opencv_videoio480.dll
├── opencv_highgui480.dll
├── opencv_imgcodecs480.dll
├── opencv_dnn480.dll
├── msvcp140.dll              # Runtime Visual C++
├── vcruntime140.dll
└── README_UTILISATION.txt    # Instructions d'utilisation
```

## 🎯 **Avantages de la version portable :**

- ✅ **Zéro installation** - fonctionne immédiatement
- ✅ **Copier-coller** sur n'importe quel PC Windows
- ✅ **Clé USB** - transportable partout
- ✅ **Pas d'administrateur** requis
- ✅ **Pas de registre** modifié

## 🔧 **Si vous voulez quand même compiler :**

### **MinGW (plus léger que Visual Studio) :**
```batch
# Installer MSYS2 (plus simple)
# Puis dans MSYS2 :
pacman -S mingw-w64-x86_64-gcc
pacman -S mingw-w64-x86_64-cmake
pacman -S mingw-w64-x86_64-opencv

# Puis compiler :
build_mingw.bat
```

### **Visual Studio Community (gratuit) :**
- Télécharger Visual Studio Community
- Installer seulement "Développement Desktop en C++"
- Utiliser `build.bat`

## 💡 **Recommandation :**

Pour un usage personnel et portable, je recommande la **version pré-compilée**. Voulez-vous que je prépare cela pour vous ?

---
**Note** : L'application finale sera exactement la même, peu importe la méthode de compilation ! 