# ScalAI V0.9 — Fichiers & contexte par session

Cette étape ajoute un contexte de fichiers propre à chaque session d'agent.

## Principes

- Un agent ne partage pas implicitement la liste de contexte d'un autre agent.
- Le contexte stocke uniquement des références de chemins, jamais le contenu du fichier ni des credentials.
- Les chemins sont dédupliqués et limités à 40 entrées par session.
- Les pièces jointes ajoutées par glisser-déposer sont mémorisées sur la session concernée.
- Les dossiers peuvent également être référencés comme contexte.
- La persistance utilise la position du panneau, jamais son identifiant runtime.
- Après redémarrage, un fichier dont la session n'existe plus n'est pas attribué à une autre session.
- Une restauration ne réinjecte pas automatiquement un chemin dans le prompt de l'agent : cela évite de relancer une action ou de modifier silencieusement le contexte conversationnel.

## Interface

Le sous-titre d'une session indique maintenant le nombre de références de contexte attachées, par exemple `Claude Code · 3 contextes`.

## Vérification

Tests dédiés : 3/3.

La suite globale conserve les échecs d'environnement déjà identifiés (zsh, packaging/notarisation, checkout Git et quelques dépendances de runtime). Aucun de ces échecs n'est lié au nouveau module de contexte.
