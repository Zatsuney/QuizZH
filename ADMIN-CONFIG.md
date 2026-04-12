# 🔐 Guide de Configuration - Identifiants Administrateur

## 📋 Résumé

Ce guide explique comment modifier les identifiants de connexion administrateur de votre site Quiz ZH.

## ⚙️ Identifiants par Défaut

Lors du premier déploiement, les identifiants sont :
- **Pseudo** : `admin`
- **Mot de passe** : `admin123`

⚠️ **CES IDENTIFIANTS DOIVENT ÊTRE CHANGÉS AVANT LA MISE EN PRODUCTION !**

## 🔧 Comment Modifier les Identifiants

### Méthode 1 : Modifier le fichier config (Recommandé)

1. **Ouvrez le fichier** `assets/js/admin-config.js` dans votre éditeur de texte
2. **Localisez la section** `ADMIN_CONFIG` :

```javascript
const ADMIN_CONFIG = {
    username: 'admin',           // ← À modifier
    password: 'admin',        // ← À modifier
    inactivityTimeout: 30 * 60 * 1000
};
```

3. **Remplacez les valeurs** :
   - `username`: Votre nouveau pseudo
   - `password`: Votre nouveau mot de passe

**Exemple :**
```javascript
const ADMIN_CONFIG = {
    username: 'supAdmin2024',
    password: 'SecureP@ssw0rd!123',
    inactivityTimeout: 30 * 60 * 1000
};
```

4. **Sauvegardez le fichier**
5. **Testez la connexion** avec vos nouveaux identifiants
6. **Poussez les changements** vers GitHub :
```bash
git add assets/js/admin-config.js
git commit -m "Update admin credentials"
git push
```

## 🛡️ Bonnes Pratiques de Sécurité

### ✅ Recommandé
- Utiliser un pseudo **unique et difficile à deviner** (min. 6 caractères)
- Utiliser un mot de passe **fort** contenant :
  - Lettres majuscules et minuscules
  - Chiffres
  - Caractères spéciaux (@, #, $, !, &, etc.)
  - Minimum 12 caractères

**Exemple de mot de passe fort :**
```
MyQ@izAdmin#2024!Secure
```

### ❌ À Éviter
- Pseudo simple comme "admin", "user", "test"
- Mot de passe contenant votre prénom, nom ou date de naissance
- Mots de passe trop courts (< 8 caractères)
- Mots du dictionnaire non modifiés
- Les mêmes identifiants que d'autres comptes

## 🔄 Modifier le Délai d'Inactivité

Par défaut, un admin inactif est déconnecté après **30 minutes**.

Pour changer cette durée dans `admin-config.js` :

```javascript
// 15 minutes
inactivityTimeout: 15 * 60 * 1000

// 1 heure
inactivityTimeout: 60 * 60 * 1000

// 2 heures
inactivityTimeout: 2 * 60 * 60 * 1000
```

## ⚠️ Sécurité Supplémentaire (GitHub Pages)

### Important à savoir

⚠️ **Sur GitHub Pages (site statique) :**
- Les identifiants sont stockés dans les fichiers JavaScript côté client
- Ils sont **visibles** dans le code source du navigateur
- Ce système est sécurisé pour un contrôle d'accès basique UNIQUEMENT
- Pour la sécurité en production, un backend avec authentification est recommandé

### Recommandations
1. N'utilisez PAS ce système pour des données sensibles
2. N'utilisez PAS un mot de passe que vous utilisez ailleurs
3. Changez régulièrement vos identifiants (tous les 3 mois minimum)
4. Suivez les bonnes pratiques de mot de passe fort

## 🔍 Vérification

Après modification des identifiants :

1. **En local** :
   - Ouvrez `index.html` dans votre navigateur
   - Cliquez sur "Accès Admin"
   - Testez avec vos nouveaux identifiants

2. **En ligne** (GitHub Pages) :
   - Allez sur votre site
   - Attendez quelques secondes que GitHub Pages recompile
   - Testez la connexion admin

## 📝 Checklist de Transmission

Si vous partagez l'accès admin avec quelqu'un d'autre :

- [ ] Pseudo et mot de passe changés
- [ ] Qualité du mot de passe vérifiée (fort)
- [ ] Identifiants communiqués de manière sécurisée
- [ ] La personne a confirmé la connexion réussie
- [ ] Un plan d'action en cas de compromission établi

## 🚨 En Cas de Problème

### Je me souviens plus du mot de passe
1. Ouvrez `admin-config.js`
2. Vérifiez les identifiants actuels
3. Testez en local d'abord

### Les identifiants ne fonctionnent pas
1. Vérifiez qu'il n'y a pas d'espace avant/après les valeurs
2. Assurez-vous d'avoir sauvegardé le fichier
3. Vérifiez que les guillemets `'` sont corrects (pas de caractères spéciaux)
4. Videz le cache du navigateur (Ctrl+Shift+Delete)
5. Rechargez la page (Ctrl+F5)

### J'ai oublié pendant combien de temps je reste connecté
Par défaut : **30 minutes d'inactivité**

## 📚 Fichiers Concernés

- `assets/js/admin-config.js` - Configuration des identifiants
- `admin-login.html` - Page de connexion
- `admin-panel.html` - Panel administrateur
- `assets/js/app.js` - Logique de vérification

## 🎯 Prochaines Étapes

Une fois vos identifiants sécurisés :
1. Testez la connexion
2. Déployez sur GitHub Pages
3. Communiquez vos identifiants en toute sécurité
4. Commencez le développement du panel admin

---

**Besoin d'aide ?** Vérifiez que vos identifiants ne contiennent pas de caractères spéciaux problématiques (guillemets, barres obliques, etc.)
