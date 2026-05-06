# Dashboard competences IA

Dashboard local pour transformer une collecte de liens, mails et ressources IA en base d'apprentissage exploitable.

## Ouvrir

Ouvrir `dashboard/index.html` dans un navigateur.

## Structure

- `Compilation_liens_X_competences.md` : index humain et plan d'integration.
- `data/resources.js` : base structuree utilisee par le dashboard.
- `data/extracted_content/` : fiches de contenu lu ou a completer.
- `dashboard/` : interface locale de consultation et filtrage.

## Principe

Chaque ressource doit indiquer si le contenu a vraiment ete lu, si la source est encore actuelle, quels concepts sont a retenir, quelle competence integrer et quelle action realiser en moins de 30 minutes.

Les liens X/Twitter qui ne sont pas lisibles automatiquement sont marques comme `X inaccessible`. Coller leur texte ou une capture dans `data/extracted_content/x-captures.md` avant de les synthetiser.

