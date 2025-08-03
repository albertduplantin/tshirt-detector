# 👕 T-Shirt Detector - Détection Intelligente de Vêtements

Application web moderne utilisant l'intelligence artificielle pour détecter automatiquement les t-shirts et autres vêtements via votre webcam.

## 🚀 Fonctionnalités

- **🎯 Détection IA en temps réel** - Reconnaissance automatique des vêtements
- **📊 Dashboard complet** - Statistiques et graphiques détaillés
- **📱 Design responsive** - Interface adaptée mobile et desktop
- **🌙 Mode sombre** - Thème clair/sombre
- **💾 Stockage local** - Données sauvegardées dans le navigateur
- **📈 Statistiques avancées** - Analyse de vos habitudes vestimentaires
- **⚙️ Paramètres personnalisables** - Seuils de confiance ajustables

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **IA**: TensorFlow.js + COCO-SSD
- **Charts**: Recharts
- **Build**: Vite
- **Deploy**: Vercel

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/tshirt-detector.git

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## 🌐 Déploiement

L'application est configurée pour un déploiement automatique sur Vercel :

1. Connectez votre repository GitHub à Vercel
2. Le déploiement se fait automatiquement à chaque push
3. L'application sera accessible via une URL HTTPS

## 🎯 Utilisation

1. **Démarrer la détection** - Cliquez sur "Démarrer" pour activer la webcam
2. **Visualiser les résultats** - L'IA analyse en temps réel vos vêtements
3. **Consulter le dashboard** - Accédez aux statistiques détaillées
4. **Personnaliser** - Ajustez les paramètres selon vos besoins

## 🔒 Confidentialité

- **100% local** - Toutes les données restent dans votre navigateur
- **Aucun serveur** - Pas de transmission de données externes
- **Respect de la vie privée** - Vos images ne quittent jamais votre appareil

## 🎨 Interface

### Desktop
- **Sidebar** avec navigation complète
- **Dashboard** avec graphiques interactifs
- **Vue détaillée** des statistiques

### Mobile
- **Menu burger** adaptatif
- **Interface optimisée** tactile
- **Responsive design** fluide

## 📊 Fonctionnalités du Dashboard

- **Détections en temps réel** - Suivi des vêtements détectés
- **Graphiques par heure** - Analyse temporelle
- **Distribution des types** - Répartition des vêtements
- **Tendances sur 7 jours** - Évolution historique
- **Statistiques avancées** - Métriques détaillées

## ⚙️ Paramètres

- **Seuil de confiance** - Précision minimale des détections
- **Intervalle de détection** - Fréquence d'analyse
- **Sauvegarde d'images** - Option de capture
- **Notifications** - Alertes personnalisées

## 🤖 Intelligence Artificielle

L'application utilise une approche hybride :

1. **COCO-SSD** pour la détection de personnes
2. **Analyse d'image personnalisée** pour classifier les vêtements
3. **Algorithmes de couleur et texture** pour distinguer les types
4. **Optimisations de performance** pour le temps réel

## 🔧 Architecture

```
src/
├── components/          # Composants React
│   ├── WebcamDetector.tsx
│   ├── Dashboard.tsx
│   ├── Statistics.tsx
│   └── SettingsPanel.tsx
├── store/              # Gestion d'état Zustand
│   └── useStore.ts
├── utils/              # Utilitaires
│   └── aiModel.ts
└── App.tsx             # Composant principal
```

## 📈 Performances

- **Détection temps réel** - Analyse toutes les 100ms
- **Optimisations IA** - Modèle MobileNet léger
- **Cache intelligent** - Stockage local optimisé
- **Responsive** - Interface fluide sur tous appareils

## 🚀 Déploiement automatique

Le projet est configuré pour Vercel avec :

- **Build automatique** à chaque commit
- **HTTPS** par défaut
- **CDN mondial** pour les performances
- **Analytics** intégrés

## 🔄 Mises à jour futures

- [ ] **Modèle IA personnalisé** entraîné spécifiquement
- [ ] **Reconnaissance de marques** de vêtements
- [ ] **Analyse de couleurs** avancée
- [ ] **Export des données** en CSV/JSON
- [ ] **Mode hors ligne** complet
- [ ] **Notifications push**

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :

- **Issues GitHub** - Rapporter des bugs
- **Discussions** - Demandes de fonctionnalités
- **Documentation** - Wiki du projet

---

**Créé avec ❤️ et l'IA moderne**