# 🎮 Quiz ZH

Un site interactive de quiz sur GitHub Pages avec système de connexion sans mot de passe pour les joueurs et espace administrateur sécurisé.

## ✨ Fonctionnalités

### Pour les Joueurs
- ✅ **Connexion sans mot de passe** - Entrez simplement votre nom pour rejoindre
- ⏳ **Salle d'attente** - Attendez que le quiz commence
- 📱 **Design Responsive** - Fonctionne sur tous les appareils (mobile, tablette, desktop)
- 🎨 **Interface moderne** - Gradient animé et animations fluides
- 💾 **Stockage local** - Les données sont sauvegardées localement (localStorage)

### Pour les Administrateurs
- 🔐 **Connexion sécurisée** - Identifiants (pseudo + mot de passe)
- 🛠️ **Panel administrateur** - Accès aux fonctionnalités de gestion
- ⚡ **Pas de serveur requis** - Aucun backend requis pour fonctionner

## 🚀 Démarrage Rapide

### En local

1. Clonez le repository ou téléchargez les fichiers
2. Ouvrez `index.html` dans votre navigateur
3. Entrez votre nom et cliquez sur "Entrer"

### Sur GitHub Pages

1. Créez un repository `sitequizzh` (ou autre nom)
2. Activez GitHub Pages dans les paramètres
3. Poussez les fichiers vers la branche `main` ou `gh-pages`
4. Accédez à `votre-username.github.io/sitequizzh`

## 🔐 Accès Administrateur

### Connexion Admin

1. Sur la page d'accueil, cliquez sur **"Accès Admin"**
2. Entrez votre pseudo et votre mot de passe
3. **Identifiants par défaut** :
   - Pseudo : `admin`
   - Mot de passe : `admin123`

### ⚠️ Modifier les Identifiants Admin

**AVANT de mettre en production, vous DEVEZ modifier les identifiants par défaut :**

1. Ouvrez le fichier `assets/js/admin-config.js`
2. Modifiez les valeurs :
   ```javascript
   const ADMIN_CONFIG = {
       username: 'votre-pseudo',      // ← Changez ceci
       password: 'votre-motdepasse',  // ← Changez ceci
       inactivityTimeout: 30 * 60 * 1000
   };
   ```
3. Sauvegardez le fichier
4. Mettez à jour votre repository sur GitHub

## 📁 Structure du Projet

```
SiteQuizZH/
├── index.html                 # Écran d'accueil avec lien admin
├── admin-login.html          # Connexion administrateur
├── admin-panel.html          # Panel administrateur
├── waiting-room.html         # Salle d'attente joueurs
├── assets/
│   ├── css/
│   │   └── style.css        # Tous les styles
│   └── js/
│       ├── app.js           # Logique JavaScript
│       └── admin-config.js  # Configuration admin
├── README.md
├── DEPLOYMENT.md
└── _config.yml
```

## 🛠️ Technologies Utilisées

- **HTML5** - Structure
- **CSS3** - Design avec gradients et animations
- **JavaScript Vanilla** - Logique sans dépendances
- **LocalStorage** - Stockage côté client

## 📝 Fonctionnalidades Détaillées

### Page de Connexion
- Validation du nom (2-30 caractères)
- Génération d'un ID de session unique
- Interface intuitive et attractive

### Salle d'Attente
- Affichage du nom du joueur
- Compteur de joueurs en temps réel (simulé)
- ID de session visible
- Déconnexion rapide
- Avertissement avant de quitter la page
- Déconnexion automatique après 30 minutes d'inactivité

## 🔒 Sécurité et Confidentialité

- Aucun mot de passe n'est stocké
- Les données sont sauvegardées localement (pas d'envoi à un serveur)
- Les sessions expirent après 30 minutes d'inactivité
- Avertissement avant de quitter la page connecté

## 📱 Compatibilité

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Navigateurs mobiles
- ✅ Tablettes

## 🎨 Personnalisation

Modifiez les couleurs dans `assets/css/style.css` :

```css
:root {
    --primary-color: #6366f1;      /* Violet primaire */
    --secondary-color: #ec4899;    /* Rose secondaire */
}
```

## 📄 License

Open source - Libre d'utilisation

## 👤 Auteur

Crée avec ❤️ pour les joueurs
