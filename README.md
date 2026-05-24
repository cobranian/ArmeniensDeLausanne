# Communauté Arménienne de Lausanne — site web

Site statique (HTML / CSS / JS, **sans étape de build**) présentant l'histoire,
la culture, la cuisine et les événements de la communauté arménienne de Lausanne.

## Lancer le site en local

Ne pas ouvrir `index.html` en `file://` (certaines ressources ne se chargeront
pas correctement). Servez le dossier en HTTP :

```bash
python -m http.server 5500
# puis ouvrir http://localhost:5500
```

(ou `npx serve .`, ou l'extension « Live Server » de VS Code)

## Structure

```
index.html        Page unique, sections ancrées (#accueil, #histoire, …)
css/styles.css     Styles, variables de couleurs, responsive
js/main.js         Menu mobile, en-tête au défilement, animations d'apparition
favicon.svg        Icône (Ararat + bande tricolore)
Images/            Photos et peintures (référencées telles quelles)
```

## Modifier le contenu

Tout le texte est dans `index.html`. Points d'édition fréquents :

- **Événements** — section `#evenements`. Dupliquez un bloc
  `<article class="event-card">` et mettez à jour date / titre / lieu.
  Les événements actuels sont des **exemples** à adapter.
- **Coordonnées** — section `#contact` : remplacez les valeurs marquées
  `[à compléter]` (e-mail, adresse, réseaux sociaux).
- **Formulaire** — purement démonstratif (site statique = pas de serveur).
  Pour le rendre fonctionnel, branchez l'attribut `action` sur un service de
  formulaire (ex. Formspree), ou supprimez-le au profit du lien e-mail.
- **Images** — déposez les fichiers dans `Images/` et référencez-les ;
  encodez les espaces dans les chemins (`Images/mon%20image.jpg`).

## Hébergement (Firebase)

Le site est déployé sur **Firebase Hosting**, projet `armeniensdelausanne`.
Déploiement manuel depuis ce dossier :

```bash
firebase deploy --only hosting
```

### À faire prochainement

- Versionner `.firebaserc`, `firebase.json` et `.gitignore` (aujourd'hui non
  suivis par Git — la configuration n'existe que dans l'arborescence locale).

### À reprendre plus tard

- **Second *Owner* Firebase.** Le projet n'a qu'un seul propriétaire (compte
  Google personnel du mainteneur). Ajouter un·e membre du comité comme *Owner*
  dans la console Firebase (IAM) dès qu'un engagement durable est confirmé,
  pour éviter un point unique de défaillance.
- **Enregistrer `armeniensdelausanne.ch` (pluriel).** Chez le même registrar
  que `armeniendelausanne.ch` (singulier, déjà détenu), afin d'aligner l'URL
  sur l'identité du site (« Arméniens » au pluriel partout dans le contenu).
- **Connecter les deux domaines à Firebase Hosting.** Pluriel comme domaine
  canonique ; singulier en redirection 301 vers le pluriel (préserve
  l'adresse e-mail existante et rattrape les fautes de frappe).
- **Dépôt Git dédié + déploiement automatique.** Le code vit aujourd'hui dans
  un dépôt monorepo personnel mêlant des projets sans lien. Le jour où des
  contributeur·rices externes s'impliquent ou que les déploiements deviennent
  fréquents : extraire ce dossier dans son propre dépôt GitHub puis ajouter
  un *workflow* GitHub Actions qui exécute `firebase deploy` à chaque *push*.

## À décider plus tard

- Source de données pour des événements gérés par des bénévoles non techniciens
  (discussion en cours : CMS « headless » à jeton public vs petite fonction
  serverless). Aujourd'hui : événements en statique dans `index.html`.
- Multilingue (français / arménien / anglais) si besoin.
