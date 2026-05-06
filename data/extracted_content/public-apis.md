# Public APIs

Statut : contenu lu le 2026-05-06  
Source : https://github.com/public-apis/public-apis

## Synthese

Public APIs est un depot GitHub communautaire qui reference des APIs publiques par domaine : business, developpement, validation de donnees, email, finance, machine learning, securite, meteo, etc.

Le depot est utile comme catalogue d'outils pour agents, mais il ne faut pas le traiter comme une garantie de qualite. Chaque API doit etre reverifiee : disponibilite, auth, CORS, prix, limites, licence, conditions d'utilisation.

## Concepts a integrer

- Une API devient un tool d'agent quand elle a un schema d'entree/sortie clair.
- Les APIs publiques sont parfaites pour prototyper.
- La fiabilite doit etre testee avant usage client.
- Les donnees sensibles ne doivent pas etre envoyees a une API inconnue.

## Action 30 minutes

Choisir 3 APIs utiles pour tes agents :

- validation email/domain,
- donnees entreprise,
- meteo/logistique/finance selon projet.

Pour chacune : noter auth, endpoint test, limite, risque.

## Mini-projet

Agent "enrichisseur fiche prospect" :

1. Entreprise ou domaine en entree.
2. Appel API publique.
3. Nettoyage donnees.
4. Score confiance.
5. Fiche Markdown exploitable.

