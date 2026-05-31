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

- **Événements** — section `#evenements`. La liste est **rafraîchie
  automatiquement** chaque jour depuis [armenopole.com](https://armenopole.com/ArmenianEvents)
  (voir « Agenda — mise à jour automatique » plus bas). Ne **pas** éditer
  `js/agenda-data.js` à la main : les modifications seront écrasées au
  prochain scrape. Pour changer la mise en forme ou les libellés UI, voir
  `js/agenda.js` et la section `.agenda*` de `css/styles.css`.
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

## Agenda — mise à jour automatique

L'agenda (`#evenements`) est généré à partir d'un instantané quotidien de
[armenopole.com/ArmenianEvents](https://armenopole.com/ArmenianEvents).

- **Workflow** : `.github/workflows/agenda-refresh.yml` (cron `12 4 * * *`,
  soit ~06h12 heure de Lausanne).
- **Scraper** : `scripts/scrape-armenopole.mjs` — fetch + parse (cheerio) +
  écrit `js/agenda-data.js` (trié par pays → région → ville → date → heure).
- **Rendu côté navigateur** : `js/agenda.js` regroupe les événements en
  `<details>` repliables par pays. Suisse ouverte par défaut.
- **Sécurité du contenu** : si Armenopole change leur HTML et que moins de
  40 événements sont parsés, le scraper sort en erreur sans toucher au
  fichier — l'ancien agenda reste affiché jusqu'à correction.

### Déclencher manuellement

GitHub → onglet *Actions* → *Daily agenda refresh* → *Run workflow*.

### Secret GitHub requis (une fois)

Pour que le workflow puisse déployer sur Firebase après commit :

1. Firebase Console → *Project settings* → *Service accounts* → *Generate
   new private key* → télécharge un JSON.
2. GitHub → *Settings* → *Secrets and variables* → *Actions* → *New
   repository secret* :
   - Nom : `FIREBASE_SERVICE_ACCOUNT_ARMENIENSDELAUSANNE`
   - Valeur : contenu intégral du JSON (accolades incluses).
3. *Settings* → *Actions* → *General* → *Workflow permissions* → cocher
   *Read and write permissions* (sinon le bot ne peut pas commit/push).

Sans ce secret, la moitié *commit* du workflow fonctionne, mais l'étape
*deploy* échoue — pas de déploiement Firebase, le site reste en l'état
jusqu'à un `firebase deploy --only hosting` manuel.

### Lancer le scraper en local (debug)

```bash
npm install cheerio     # dépendance dev uniquement (gitignored)
node scripts/scrape-armenopole.mjs
```

## À décider plus tard

- Multilingue (français / arménien / anglais) si besoin.
