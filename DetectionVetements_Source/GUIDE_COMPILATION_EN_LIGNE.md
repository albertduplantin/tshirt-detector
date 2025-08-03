# 🚀 Guide de Compilation en Ligne - GitHub Actions

## ✅ **Solution 100% Automatique - Aucune Installation Requise**

Ce guide vous explique comment obtenir votre version portable de l'application de détection de vêtements **sans rien installer** sur votre PC.

## 📋 **Étapes pour obtenir votre version portable :**

### **Étape 1 : Créer un compte GitHub (si vous n'en avez pas)**
1. Allez sur https://github.com
2. Cliquez sur "Sign up" (S'inscrire)
3. Créez votre compte gratuit

### **Étape 2 : Créer un nouveau repository**
1. Cliquez sur le bouton "+" en haut à droite
2. Sélectionnez "New repository"
3. Nommez-le : `DetectionVetements`
4. Laissez-le public
5. Cliquez sur "Create repository"

### **Étape 3 : Uploader les fichiers du projet**
1. Dans votre nouveau repository, cliquez sur "uploading an existing file"
2. Glissez-déposez tous les fichiers du projet :
   - `main.cpp`
   - `CMakeLists.txt`
   - `build.bat`
   - `README.md`
   - `.github/workflows/build.yml`
   - Tous les autres fichiers
3. Cliquez sur "Commit changes"

### **Étape 4 : Lancer la compilation automatique**
1. Allez dans l'onglet "Actions" de votre repository
2. Vous verrez le workflow "Build Detection Vetements"
3. Cliquez sur "Run workflow"
4. Sélectionnez la branche "main"
5. Cliquez sur "Run workflow"

### **Étape 5 : Récupérer votre version portable**
1. Attendez 5-10 minutes que la compilation se termine
2. Une fois terminée, cliquez sur le workflow terminé
3. Descendez jusqu'à "Artifacts"
4. Cliquez sur "DetectionVetements_Portable" pour télécharger
5. Extrayez le fichier ZIP sur votre PC

## 🎯 **Ce que vous obtiendrez :**

```
DetectionVetements_Portable/
├── detection_vetements.exe    # Application principale
├── opencv_core480.dll        # Bibliothèques OpenCV
├── opencv_imgproc480.dll
├── opencv_videoio480.dll
├── opencv_highgui480.dll
├── opencv_imgcodecs480.dll
├── opencv_dnn480.dll
├── msvcp140.dll              # Runtime Visual C++
├── vcruntime140.dll
├── Lancer_Application.bat    # Script de lancement
└── README.txt               # Instructions d'utilisation
```

## ✅ **Avantages de cette méthode :**

- 🎯 **Zéro installation** sur votre PC
- ⚡ **Compilation automatique** en 5-10 minutes
- 🔄 **Mise à jour automatique** à chaque modification
- 📦 **Package prêt à l'emploi**
- 💾 **Version portable** qui fonctionne partout

## 🚀 **Utilisation de votre version portable :**

1. **Extrayez** le fichier ZIP téléchargé
2. **Double-cliquez** sur `detection_vetements.exe`
3. L'application s'ouvre automatiquement
4. Votre webcam se lance
5. La détection commence en temps réel

## 🔧 **Contrôles :**

- **Q** : Quitter l'application
- **S** : Sauvegarder une capture d'écran
- **R** : Redémarrer la détection

## 📱 **Compatibilité :**

- ✅ Windows 10/11 (64-bit)
- ✅ Aucune installation requise
- ✅ Fonctionne sur clé USB
- ✅ Pas de droits administrateur

## 🔄 **Mise à jour automatique :**

Chaque fois que vous modifiez le code et le poussez sur GitHub :
1. La compilation se lance automatiquement
2. Une nouvelle version portable est créée
3. Vous pouvez la télécharger depuis les Actions

## 🆘 **Dépannage :**

### **La compilation échoue :**
- Vérifiez que tous les fichiers sont uploadés
- Regardez les logs d'erreur dans l'onglet Actions
- Assurez-vous que le fichier `.github/workflows/build.yml` est présent

### **L'application ne se lance pas :**
- Vérifiez que votre webcam est connectée
- Fermez les autres applications qui utilisent la webcam
- Essayez de lancer `Lancer_Application.bat`

### **Aucun vêtement détecté :**
- Assurez-vous d'être bien visible dans le cadre
- Éclairage suffisant recommandé
- Vêtement de couleur contrastée avec l'arrière-plan

## 💡 **Conseils :**

1. **Gardez votre repository public** pour bénéficier des Actions gratuites
2. **Utilisez des noms de fichiers sans accents** pour éviter les problèmes
3. **Testez l'application** sur différents PC pour vérifier la portabilité
4. **Sauvegardez les versions** qui fonctionnent bien

## 🎉 **Félicitations !**

Vous avez maintenant une application de détection de vêtements **100% portable** qui fonctionne sur n'importe quel PC Windows sans installation !

---

**Note** : Cette méthode utilise GitHub Actions qui offre 2000 minutes gratuites par mois, largement suffisant pour ce projet. 