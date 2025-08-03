# 📸 Guide Visuel - Upload GitHub en 5 Minutes

## 🎯 **Objectif :**
Obtenir votre version portable en 5 minutes avec des captures d'écran.

## 📋 **Prérequis (2 minutes) :**

### **1. Installer Git**
- Téléchargez : https://git-scm.com/downloads
- Double-cliquez sur l'installateur
- Suivez les instructions (cliquez "Next" partout)

### **2. Installer GitHub CLI**
- Téléchargez : https://cli.github.com/
- Double-cliquez sur l'installateur
- Suivez les instructions

## 🚀 **Processus en 3 étapes :**

### **Étape 1 : Créer le token (1 minute)**
1. Allez sur : https://github.com/settings/tokens
2. Cliquez sur **"Generate new token (classic)"**
3. **Note** : `DetectionVetements-Automation`
4. **Expiration** : `90 days`
5. **Autorisations** :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `write:packages` (Upload packages to GitHub Package Registry)
6. Cliquez sur **"Generate token"**
7. **Copiez immédiatement** le token (il ressemble à : `ghp_xxxxxxxxxxxxxxxxxxxx`)

### **Étape 2 : Lancer le script (30 secondes)**
1. Double-cliquez sur `one_click_upload.bat`
2. Collez votre token quand demandé
3. Appuyez sur Entrée
4. Attendez que le script se termine

### **Étape 3 : Récupérer votre version (3 minutes)**
1. Le navigateur s'ouvre automatiquement
2. Attendez 5-10 minutes que la compilation se termine
3. Cliquez sur **"DetectionVetements_Portable"** pour télécharger
4. Extrayez le fichier ZIP
5. Double-cliquez sur `detection_vetements.exe`

## 🎉 **Résultat :**
Votre application de détection de vêtements fonctionne !

## 🔧 **En cas de problème :**

### **Erreur : "Git n'est pas installé"**
- Installez Git depuis https://git-scm.com/downloads
- Redémarrez le script

### **Erreur : "GitHub CLI n'est pas installé"**
- Installez GitHub CLI depuis https://cli.github.com/
- Redémarrez le script

### **Erreur : "Bad credentials"**
- Vérifiez que le token est correct
- Recréez un nouveau token

### **Erreur : "Repository not found"**
- Vérifiez que le repository https://github.com/albertduplantin/webcam existe
- Créez-le si nécessaire

## 💡 **Conseils :**

1. **Gardez le token** dans un endroit sûr
2. **Testez l'application** sur différents PC
3. **Sauvegardez** les versions qui fonctionnent
4. **Partagez** l'application avec vos amis !

## 📞 **Support :**

Si vous avez des problèmes :
1. Vérifiez que tous les fichiers sont présents
2. Assurez-vous que Git et GitHub CLI sont installés
3. Vérifiez que votre token a les bonnes autorisations
4. Redémarrez le script

---

**Temps total estimé : 5 minutes maximum !** 