# WordPress MCP tool access for AI agents

Statut : contenu lu le 2026-05-06  
Source canonique : https://wordpress.com/support/model-context-protocol-mcp-settings/

## Synthese

WordPress.com supporte le Model Context Protocol pour permettre a des agents IA externes de lire et agir sur un compte WordPress.com. Les clients cites incluent Claude, ChatGPT, Cursor, VS Code, Gemini et Perplexity.

Le point important n'est pas seulement "connecter WordPress a une IA". C'est le modele de controle :

- activation au niveau compte ou site,
- outils separes en lecture et ecriture,
- droits limites par le role WordPress,
- OAuth 2.1 pour l'autorisation,
- confirmation avant operations d'ecriture,
- possibilite de desactiver certains sites ou certains outils.

## Concepts a integrer

- MCP comme couche standardisee entre agent et application metier.
- Outils read/write comme surface de permission.
- Les roles WordPress restent la base de securite.
- Un agent doit demander confirmation avant les actions risquées.
- Les suppressions ne doivent jamais etre automatisees sans garde-fou.

## Action 30 minutes

Faire une matrice des outils souhaitables pour une agence :

- lecture posts/pages,
- creation de brouillon,
- modification de brouillon,
- gestion categories/tags,
- lecture stats,
- moderation commentaires,
- interdiction publication/suppression sans confirmation.

## Mini-projet

Agent "idee vers brouillon WordPress" :

1. L'utilisateur donne un sujet ou une ressource.
2. L'agent propose un plan.
3. L'agent cree un brouillon.
4. L'agent ajoute tags et categorie.
5. L'agent rend un rapport et attend validation humaine.

