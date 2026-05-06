# Claude Security / analyse de vulnerabilites code

Statut : contenu lu via source secondaire le 2026-05-06  
Source secondaire : ITPro, mai 2026  
Source utilisateur : https://share.google/ZAEDef4iveFqqQy5k

## Synthese

L'article decrit Claude Security comme une beta publique orientee analyse de codebases, detection de vulnerabilites, generation de correctifs proposes, scores de confiance, justification de severite, scans planifies et integrations type Slack/Jira.

Il faut verifier la documentation officielle Anthropic avant usage, car la source lue est une source secondaire.

## Concepts a integrer

- scan securite assiste par IA,
- score de confiance,
- severite justifiee,
- correctif propose,
- scan planifie,
- export dans workflows DevSecOps.

## Action 30 minutes

Creer une checklist securite IA :

- secrets,
- permissions tools,
- injections prompt/tool,
- auth,
- dependances,
- logs,
- donnees sensibles.

## Mini-projet

Agent "pre-review securite" :

1. Lit un petit repo.
2. Liste risques potentiels.
3. Propose correctifs.
4. Ne modifie rien sans validation.
5. Associe chaque risque a un test.

