# 📚 Guide de Déploiement sur GitHub Pages

## Étape 1 : Préparer votre Repository GitHub

### Option A : Créer un nouveau repository

1. Allez sur **github.com** et connectez-vous
2. Cliquez sur **"New repository"** (en haut à droite)
3. **Repository name** : `sitequizzh` (ou le nom que vous préférez)
4. Description : `Plateforme de quiz interactive sans mot de passe`
5. Choisissez **Public** (pour que GitHub Pages fonctionne)
6. Cliquez sur **Create repository**

### Option B : Utiliser un repository existant

Assurez-vous simplement que le repository est **Public**

## Étape 2 : Mettre en place GitHub Pages

1. Allez dans **Settings** du repository
2. Dans la barre latérale, cliquez sur **Pages** (à gauche)
3. Sous **Source**, sélectionnez :
   - **Branch** : `main` (ou `master`)
   - **Folder** : `/ (root)`
4. Cliquez sur **Save**
5. GitHub générera une URL comme : `https://your-username.github.io/sitequizzh`

## Étape 3 : Pousser vos fichiers vers GitHub

### Depuis Git Bash ou Terminal

```bash
# Naviguer vers votre dossier
cd C:\Users\xShay\Desktop\SiteQuizZH

# Initialiser le repository (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit: Quiz ZH application"

# Ajouter le remote (remplacez YOUR-USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/YOUR-USERNAME/sitequizzh.git

# Renommer la branche en 'main' si nécessaire
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

### Depuis GitHub Desktop

1. Cliquez sur **File** → **Add Local Repository**
2. Sélectionnez le dossier `C:\Users\xShay\Desktop\SiteQuizZH`
3. Cliquez sur **Publish repository**
4. Choisissez un nom (`sitequizzh`)
5. Assurez-vous que **Keep this code private** n'est PAS coché
6. Cliquez sur **Publish Repository**

## Étape 4 : Vérifier le déploiement

1. Allez dans l'onglet **Settings** de votre repository
2. Cliquez sur **Pages**
3. Vous devriez voir un message vert : _"Your site is live at https://your-username.github.io/sitequizzh"_
4. Cliquez sur le lien pour accéder à votre site

## 🔗 Accéder à votre site

Une fois déployé, votre site sera disponible à :
```
https://your-username.github.io/sitequizzh
```

## 📝 Mettre à jour le site

Après chaque modification, préparez et poussez les changements :

```bash
git add .
git commit -m "Description des changements"
git push
```

GitHub Pages recompilera automatiquement votre site en quelques secondes.

## ⚙️ Configuration personnalisée (optionnel)

### Modifier les couleurs

Éditez `assets/css/style.css` et changez :

```css
:root {
    --primary-color: #6366f1;      /* Votre couleur primaire */
    --secondary-color: #ec4899;    /* Votre couleur secondaire */
}
```

### Modifier le titre et la description

Éditez `_config.yml` et mettez à jour :

```yaml
title: Votre Titre
description: Votre Description
url: "https://your-username.github.io/sitequizzh"
baseurl: "/sitequizzh"
```

### Utiliser un domaine personnalisé

1. Dans **Settings** → **Pages**
2. Sous **Custom domain**, entrez votre domaine (ex: `quiz.example.com`)
3. Cliquez sur **Save**
4. Configurez les DNS de votre domaine

## 🚨 Dépannage

### Le site n'apparaît pas
- Vérifiez que le repository est **Public**
- Attendez quelques minutes (GitHub Pages prend du temps à compiler)
- Vérifiez l'onglet **Actions** pour les erreurs

### Les fichiers CSS/JS ne chargent pas
- Vérifiez que les chemins sont corrects
- Si vous utilisez un `baseurl`, mettez à jour les chemins dans les fichiers HTML

### Problème avec BaseURL
Si votre site n'est pas à la racine, modifiez les imports dans les fichiers HTML :

```html
<!-- Avant -->
<link rel="stylesheet" href="assets/css/style.css">

<!-- Après (avec baseurl) -->
<link rel="stylesheet" href="/sitequizzh/assets/css/style.css">
```

## ✅ Checklist Finale

- [ ] Repository créé et public
- [ ] GitHub Pages activé
- [ ] Fichiers poussés vers GitHub
- [ ] Site accessible via l'URL GitHub Pages
- [ ] Écran de connexion fonctionne
- [ ] Salle d'attente s'affiche après connexion
- [ ] Style et animations s'affichent correctement
- [ ] Boutons fonctionnent comme prévu

Vous êtes prêt ! 🎉
