# Atelier Renaissance — Site vitrine statique

Ce dépôt contient un modèle de site vitrine en français pour un restaurant fictif, **Atelier Renaissance**, inspiré d'une comfort food américaine revisitée avec des produits bretons. Le projet est 100 % statique (HTML/CSS/JS), prêt à être ouvert dans un navigateur ou déployé sur n'importe quel hébergement statique (GitHub Pages, Netlify, Vercel, etc.).

## Pages incluses
- **`index.html`** : page d'accueil avec héros, présentation rapide, plats phares, témoignages clients, formulaire de contact et bloc « Nous trouver ».
- **`menu.html`** : carte détaillée (burgers, plats signatures, accompagnements, desserts) avec un héros dédié.

## Fonctionnalités clés
- **Navigation responsive** avec hamburger et blocage du scroll en arrière-plan quand le menu est ouvert (`js/script.js`, classe `body.no-scroll`).
- **Identité visuelle cohérente** : palette bordeaux/crème, typographies Google Fonts (Playfair Display + Roboto).
- **Mise en avant des plats** : grilles d'items avec visuels, descriptions et prix.
- **Contact prêt à l'emploi** : formulaire branché sur Formspree (remplacer `yourformid` par votre ID) et lien Google Maps vers l'adresse du restaurant.

## Arborescence rapide
```
/
├─ index.html        # Page d'accueil
├─ menu.html         # Carte complète
├─ style.css         # Styles globaux + spécifiques par page
├─ js/
│  └─ script.js      # Ouverture/fermeture du menu mobile
├─ images/           # Visuels (héros, plats, favicon, etc.)
└─ SITE_AUDIT.md     # Audit existant et backlog de pistes d'amélioration
```

## Prise en main
1. **Cloner ou télécharger** le dépôt puis ouvrir le dossier dans votre éditeur :
   ```bash
   git clone <url-du-depot>
   cd atelier-renaissance
   ```
2. **Lancer en local** en ouvrant `index.html` ou `menu.html` dans votre navigateur (ou via l'extension Live Server de VS Code).
3. **Personnaliser** :
   - Remplacez les textes (nom du restaurant, descriptions, prix) dans les fichiers HTML.
   - Adaptez les couleurs et polices dans `style.css`.
   - Remplacez `yourformid` dans `index.html` par votre ID Formspree pour activer le formulaire.
   - Mettez vos propres images dans `images/` (préférez WebP/AVIF pour de meilleures performances).

## Déploiement rapide (exemples)
- **GitHub Pages** : poussez la branche principale, puis activez Pages sur le dossier racine du dépôt.
- **Netlify/Vercel** : importez le dépôt, choisissez un déploiement statique (pas de build requis), la racine `/` suffit.