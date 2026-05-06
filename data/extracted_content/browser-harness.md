# Browser Harness - agents navigateur auto-reparables

Statut : contenu lu le 2026-05-06  
Site : https://www.browser-harness.com/  
Repo : https://github.com/browser-use/browser-harness

## Synthese

Browser Harness est un projet open source de Browser Use pour connecter un LLM directement a un navigateur via CDP. Le site le decrit comme un harness mince, auto-reparable, dans lequel les agents peuvent editer leurs propres helpers pour terminer une tache.

Le README GitHub precise l'idee : une connexion websocket vers Chrome, peu d'intermediaires, et un espace `agent-workspace` ou l'agent peut creer ou ameliorer des helpers pendant l'execution. Le projet supporte Chrome local, des navigateurs cloud furtifs Browser Use, et des usages 24/7 via Browser Use Box.

## Concepts a integrer

- CDP comme couche de controle navigateur.
- Harness mince plutot que framework lourd.
- Helpers Python editables par l'agent.
- Domain skills : playbooks reutilisables par site ou par domaine.
- Auto-amelioration : l'agent formalise ce qu'il apprend dans un helper ou un skill.
- Navigateurs cloud paralleles pour les taches qui demandent isolation, proxy ou headless.

## Action 30 minutes

Lire `install.md` et `SKILL.md` du repo, puis noter :

- prerequis Chrome remote debugging,
- permissions demandees,
- emplacement des helpers,
- forme d'un domain skill,
- risques de securite,
- premier flux testable sans compte sensible.

## Mini-projet

Prototype "agent navigateur QA" :

1. Ouvrir un site de test.
2. Demander a l'agent de suivre un flux simple.
3. Laisser l'agent creer un helper si une action manque.
4. Relancer la meme tache pour verifier que le helper sert vraiment.
5. Documenter le skill genere et les limites.

## Risques

- Remote debugging peut donner une liberte tres large au navigateur.
- Ne pas connecter un profil contenant comptes sensibles ou sessions critiques.
- Toujours isoler les profils, limiter les donnees et garder des logs.
- Verifier les helpers generes avant reutilisation.

