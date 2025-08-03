# 🔐 Guide Token GitHub pour Git

## 🎯 **Objectif :**
Créer un token GitHub pour utiliser Git sans GitHub CLI.

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
1. **Note** : `DetectionVetements-Git`
2. **Expiration** : `90 days` (recommandé)
3. **Autorisations** : Sélectionnez ces cases :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)

### **Étape 4 : Générer le token**
1. Cliquez sur **"Generate token"**
2. **IMPORTANT** : Copiez immédiatement le token généré
3. Le token ne sera plus visible après cette page !

## 🚀 **Utilisation avec le script :**

### **Lancer le script :**
```batch
# Double-cliquez sur :
upload_sans_github_cli.bat
```

### **Quand Git demande vos identifiants :**
- **Nom d'utilisateur** : `albertduplantin`
- **Mot de passe** : `VOTRE_TOKEN_GITHUB` (pas votre mot de passe GitHub !)

## 🔧 **Si Git demande les identifiants :**

### **Première fois :**
1. Git va ouvrir une fenêtre d'authentification
2. **Username** : `albertduplantin`
3. **Password** : Collez votre token GitHub
4. Cliquez sur **"OK"**

### **Si la fenêtre ne s'ouvre pas :**
1. Git va demander les identifiants dans le terminal
2. Tapez votre nom d'utilisateur : `albertduplantin`
3. Tapez votre token (il ne s'affichera pas, c'est normal)
4. Appuyez sur Entrée

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

## 🔧 **Dépannage :**

### **Erreur : "Authentication failed"**
- Vérifiez que le token est correct
- Vérifiez que le token n'a pas expiré
- Vérifiez les autorisations du token

### **Erreur : "Repository not found"**
- Vérifiez que le repository existe
- Vérifiez que vous avez les droits d'accès
- Vérifiez l'orthographe du nom du repository

### **Erreur : "Permission denied"**
- Vérifiez que le token a l'autorisation `repo`
- Vérifiez que vous êtes le propriétaire du repository

## 💡 **Conseils :**

1. **Testez d'abord** avec un repository de test
2. **Gardez une copie** du token dans un endroit sûr
3. **Utilisez des tokens temporaires** pour les tests
4. **Surveillez l'utilisation** dans les paramètres GitHub

## 🎉 **Résultat attendu :**

Après utilisation du token :
1. ✅ Code uploadé automatiquement
2. ⏳ Compilation à lancer manuellement depuis GitHub
3. ✅ Version portable générée en 5-10 minutes
4. ✅ Téléchargement disponible depuis GitHub Actions

---

**Note** : Cette méthode utilise Git directement, plus simple que GitHub CLI ! 