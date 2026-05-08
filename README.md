# Dashboard competences IA

Dashboard local pour transformer une collecte de liens, mails et ressources IA en base d'apprentissage exploitable.

## Ouvrir

Ouvrir `dashboard/index.html` dans un navigateur.

## Structure

- `Compilation_liens_X_competences.md` : index humain et plan d'integration.
- `data/resources.js` : base structuree utilisee par le dashboard.
- `data/x-oembed.js` : tweets lus automatiquement, chargeables par le dashboard en local.
- `data/extracted_content/` : fiches de contenu lu ou a completer.
- `dashboard/` : interface locale de consultation et filtrage.
- `scripts/extract-x-oembed.mjs` : extraction automatique des textes X/Twitter via oEmbed.

## Principe

Chaque ressource doit indiquer si le contenu a vraiment ete lu, si la source est encore actuelle, quels concepts sont a retenir, quelle competence integrer et quelle action realiser en moins de 30 minutes.

Les liens X/Twitter sont lus automatiquement via l'endpoint officiel oEmbed quand possible :

```bash
node scripts/extract-x-oembed.mjs
```

Le script genere :

- `data/extracted_content/x-oembed.md`
- `data/extracted_content/x-oembed.json`
- `data/x-oembed.js`

Les medias, images, videos ou threads incomplets peuvent encore demander un complement dans `data/extracted_content/x-captures.md`.
