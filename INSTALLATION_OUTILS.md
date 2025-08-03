# 🛠️ Installation des Outils pour Automatisation

## 📋 **Outils nécessaires pour l'automatisation :**

### **1. Git (Obligatoire)**
- **Téléchargement** : https://git-scm.com/downloads
- **Installation** : Double-cliquez sur l'installateur et suivez les instructions
- **Vérification** : Ouvrez un terminal et tapez `git --version`

### **2. GitHub CLI (Recommandé)**
- **Téléchargement** : https://cli.github.com/
- **Installation** : Double-cliquez sur l'installateur
- **Connexion** : Ouvrez un terminal et tapez `gh auth login`

### **3. PowerShell (Déjà installé sur Windows 10/11)**

## 🚀 **Utilisation des scripts d'automatisation :**

### **Option A : Script Batch (Simple)**
```batch
# Double-cliquez sur :
auto_github_upload.bat
```

### **Option B : Script PowerShell (Avancé)**
```powershell
# Ouvrez PowerShell et tapez :
.\auto_github_upload.ps1
```

## ✅ **Ce que font les scripts automatiquement :**

1. ✅ **Vérifient** que Git et GitHub CLI sont installés
2. ✅ **Se connectent** à votre compte GitHub
3. ✅ **Initialisent** le repository Git local
4. ✅ **Uploadent** tous les fichiers vers GitHub
5. ✅ **Lancent** la compilation automatique
6. ✅ **Ouvrent** le navigateur sur la page des Actions

## 🎯 **Résultat :**

Après 5-10 minutes, vous aurez votre version portable téléchargeable depuis :
https://github.com/albertduplantin/webcam/actions

## 🔧 **Dépannage :**

### **Erreur : "Git n'est pas installé"**
- Installez Git depuis https://git-scm.com/downloads
- Redémarrez le terminal après installation

### **Erreur : "GitHub CLI n'est pas installé"**
- Installez GitHub CLI depuis https://cli.github.com/
- Redémarrez le terminal après installation

### **Erreur : "Connexion GitHub requise"**
- Tapez `gh auth login` dans le terminal
- Suivez les instructions de connexion

## 💡 **Alternative manuelle :**

Si vous préférez faire manuellement :
1. Allez sur https://github.com/albertduplantin/webcam
2. Cliquez sur "Add file" → "Upload files"
3. Glissez-déposez tous les fichiers
4. Cliquez sur "Commit changes"
5. Allez dans l'onglet "Actions"
6. Cliquez sur "Run workflow"

---

**Note** : Les scripts automatiques sont plus rapides et moins sujets aux erreurs ! 