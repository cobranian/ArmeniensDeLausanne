# Page de don — mise en place (à reprendre en août)

Cette note explique comment **activer les dons par carte de crédit / Twint** sur
la page `don.html`. La page est déjà construite et en ligne, mais en mode
« bientôt disponible » : il manque seulement le **lien de paiement** du
prestataire. Tout est conçu pour qu'il n'y ait **qu'une seule ligne à coller**.

## État actuel (juin 2026)

- ✅ `don.html` — page-maquette autonome (style parchemin de la revue), avec
  montants suggérés 20 / 50 / 100 CHF + montant libre, bandeau de réassurance,
  section « Votre don en action », alternative virement bancaire.
- ✅ i18n FR / EN / HY inline + sélecteur de langue (comme `doudouk.html`,
  `peintres.html`, `ArmenianSwissNetwork/`).
- ✅ Lien **« Soutenir »** (♥) dans la navigation principale (`index.html` +
  clé `nav.don` dans `js/i18n.js`).
- ⏳ **Bouton de don inactif** tant que `DONATION_URL` est vide → affiche
  « Le paiement en ligne sera activé prochainement ».
- ⏳ IBAN / titulaire du virement = placeholders `[à compléter]`.

## Décisions déjà prises

| Point | Choix |
|---|---|
| Moyens de paiement | **Twint + cartes** |
| Statut | **Association enregistrée avec compte bancaire** |
| Types de dons | **Montant libre + montants suggérés** (pas de récurrent pour l'instant) |
| Reçus | **Reçus fiscaux souhaités** |
| Prestataire recommandé | **RaiseNow** (suisse, gère Twint + cartes + reçus, sans backend). Alternative : Stripe Payment Link (Twint OK, mais reçus à gérer soi-même). |

## Checklist de reprise (août)

### 1. Côté association / juridique
- [ ] Confirmer auprès de l'**ACI Vaud** si l'association est **reconnue
      d'utilité publique / exonérée d'impôt** → détermine si les reçus sont
      **fiscalement déductibles**.
  - Si oui → on peut mentionner la déductibilité sur la page.
  - Si non → garder la formulation prudente actuelle (« la déductibilité
    dépend du statut de l'association »), reçu = simple confirmation.

### 2. Créer le compte prestataire (RaiseNow recommandé)
- [ ] Ouvrir un compte **au nom de l'association**, relié à son **IBAN**.
- [ ] Configurer une campagne de don : devise **CHF**, moyens **Twint + cartes**,
      montant libre autorisé.
- [ ] Récupérer le **lien de paiement hébergé** (ex. `https://donate.raisenow.io/xxxxx`).
- [ ] Vérifier si le lien accepte un **paramètre de montant** dans l'URL
      (souvent `?amount=`) — pour préremplir le montant choisi sur la page.

### 3. Brancher le lien dans `don.html`
Ouvrir `don.html`, descendre au bloc `<script id="don-config">` (tout en bas) :

```js
window.DON_CONFIG = {
  DONATION_URL: "",        // ← coller ici le lien RaiseNow / Stripe
  AMOUNT_PARAM: "amount",  // ← nom du paramètre de montant, ou "" si non géré
  CURRENCY: "CHF"
};
```

- **`DONATION_URL`** : coller le lien du prestataire. C'est la seule ligne
  indispensable. Dès qu'elle est remplie, le bouton devient actif et ouvre le
  prestataire dans un nouvel onglet.
- **`AMOUNT_PARAM`** : si le prestataire accepte le montant en paramètre
  d'URL, laisser `"amount"` (ou mettre le nom exact attendu). Sinon, mettre
  `""` → le donateur saisira le montant directement chez le prestataire.
- **`CURRENCY`** : reste `"CHF"`.

> Comment le montant est transmis : la page ajoute `?amount=50` (ou `&amount=50`)
> à `DONATION_URL` selon le montant cliqué/saisi. À vérifier que ça correspond
> à ce qu'attend le prestataire ; sinon `AMOUNT_PARAM: ""`.

### 4. Compléter le virement bancaire (section « alternative »)
Les libellés FR/EN/HY sont dans le `DICT` inline de `don.html`. Remplacer :
- [ ] `alt.holder.v` : `[à compléter]` → nom exact du titulaire du compte.
- [ ] `alt.iban.v` : `[IBAN à compléter]` → IBAN réel.
- (à faire dans les **trois langues** : `fr`, `en`, `hy` du `DICT`.)

### 5. Vérifier puis publier
- [ ] Tester en local : `python -m http.server 5500` → `http://localhost:5500/don.html`
  - Cliquer un montant, saisir un montant libre, vérifier le libellé du bouton.
  - Cliquer « Faire un don » → doit ouvrir le prestataire avec le bon montant.
  - Tester les 3 langues (FR/EN/HY).
- [ ] Faire un **don test réel** (petit montant) via le prestataire, vérifier la
      réception sur le compte et le reçu.
- [ ] Commit + push sur `main`, puis déployer : `firebase deploy --only hosting`.

## Notes techniques

- **Aucun backend** : le site est statique. La page ne touche jamais aux
  numéros de carte — tout se passe chez le prestataire (lien hébergé).
- **Où vit la logique** : bloc `<script id="don-config">` (config) + le
  `<script>` « LOGIQUE DE DON » juste en dessous (sélection du montant,
  construction de l'URL, état actif/inactif du bouton).
- **i18n** : ce fichier a son **propre** dictionnaire inline (`DICT` dans
  `don.html`), séparé de `js/i18n.js`. Toute modif de texte visible se fait
  dans les 3 langues du `DICT`. Seule la clé de navigation `nav.don` vit dans
  `js/i18n.js` (+ le `<li>` dans `index.html`).
- **Déploiement** : Firebase Hosting (projet `armeniensdelausanne`), publié
  depuis `main`. Le bot agenda redéploie `main` quotidiennement — donc tout
  doit être mergé dans `main` pour rester en ligne.

## Évolutions possibles (plus tard)
- Ajouter un **don récurrent (mensuel)** : la plupart des prestataires le
  proposent ; il faudrait un second lien ou un toggle ponctuel/mensuel sur la page.
- Remplacer la redirection par un **widget intégré** (RaiseNow propose un
  embed) si on veut garder le donateur sur le site.
