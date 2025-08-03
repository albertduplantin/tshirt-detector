# 🔐 Guide de Création du Token GitHub

## 🎯 **Objectif :**
Créer un token d'accès personnel GitHub avec les autorisations nécessaires pour automatiser l'upload et la compilation.

## 📋 **Étapes pour créer le token :**

### **Étape 1 : Accéder aux paramètres GitHub**
1. Connectez-vous à votre compte GitHub
2. Cliquez sur votre photo de profil en haut à droite
3. Sélectionnez **"Settings"** (Paramètres)

### **Étape 2 : Accéder aux tokens**
1. Dans le menu de gauche, cliquez sur **"Developer settings"**
2. Cliquez sur **"Personal access tokens"**
3. Cliquez sur **"Tokens (classic)"**
4. Cliquez sur **"Generate new token (classic)"**

### **Étape 3 : Configurer le token**
1. **Note** : `DetectionVetements-Automation`
2. **Expiration** : `90 days` (recommandé)
3. **Autorisations** : Sélectionnez ces cases :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `write:packages` (Upload packages to GitHub Package Registry)

### **Étape 4 : Générer le token**
1. Cliquez sur **"Generate token"**
2. **IMPORTANT** : Copiez immédiatement le token généré
3. Le token ne sera plus visible après cette page !

## 🚀 **Utilisation du token :**

### **Option A : Script automatique (Recommandée)**
```powershell
# Ouvrez PowerShell et tapez :
.\auto_github_with_auth.ps1
```

Le script vous demandera le token et fera tout automatiquement.

### **Option B : Manuel avec GitHub CLI**
```bash
# Connexion avec le token
echo "VOTRE_TOKEN_ICI" | gh auth login --with-token

# Vérifier la connexion
gh auth status

# Upload du code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/albertduplantin/webcam.git
git push -u origin main

# Lancer la compilation
gh workflow run "Build Detection Vetements.yml"
```

## 🔒 **Sécurité du token :**

### **⚠️ Règles importantes :**
- **Ne partagez JAMAIS** votre token
- **Ne le committez pas** dans votre code
- **Supprimez-le** si vous ne l'utilisez plus
- **Régénérez-le** si vous pensez qu'il a été compromis

### **🔄 Rotation du token :**
- Le token expire après 90 jours
- Créez un nouveau token avant expiration
- Supprimez l'ancien token

## 🎯 **Autorisations expliquées :**

| Autorisation | Description | Nécessaire pour |
|--------------|-------------|-----------------|
| `repo` | Accès complet aux repositories | Upload du code |
| `workflow` | Gestion des workflows GitHub Actions | Lancement de la compilation |
| `write:packages` | Upload de packages | Création des artefacts |

## 🔧 **Dépannage :**

### **Erreur : "Bad credentials"**
- Vérifiez que le token est correct
- Vérifiez que le token n'a pas expiré
- Vérifiez les autorisations du token

### **Erreur : "Repository not found"**
- Vérifiez que le repository existe
- Vérifiez que vous avez les droits d'accès
- Vérifiez l'orthographe du nom du repository

### **Erreur : "Workflow not found"**
- Vérifiez que le fichier `.github/workflows/build.yml` existe
- Vérifiez l'orthographe du nom du workflow

## 💡 **Conseils :**

1. **Testez d'abord** avec un repository de test
2. **Gardez une copie** du token dans un endroit sûr
3. **Utilisez des tokens temporaires** pour les tests
4. **Surveillez l'utilisation** dans les paramètres GitHub

## 🎉 **Résultat attendu :**

Après utilisation du token :
1. ✅ Code uploadé automatiquement
2. ✅ Compilation lancée automatiquement
3. ✅ Version portable générée en 5-10 minutes
4. ✅ Téléchargement disponible depuis GitHub Actions

---

**Note** : Ce token donne accès à vos repositories, utilisez-le avec précaution ! 