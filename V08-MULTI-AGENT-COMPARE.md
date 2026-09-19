# ScalAI V0.8 — comparaison multi-agents

Cette version ajoute une vraie surface de comparaison au workspace sans interrompre les PTY des sessions non sélectionnées.

## Ajouts
- sélection de 2 à 4 sessions vivantes ;
- filtre automatique des sessions fermées et des panneaux non-agents ;
- vue côte à côte en grille ;
- chaque session garde son propre terminal, contexte et processus ;
- les sessions non sélectionnées restent montées en arrière-plan pour ne pas interrompre leur travail ;
- layouts 2 colonnes pour 2–4 agents, 1 colonne sur petit écran ;
- bouton `Comparer` dans le bandeau Workspace ;
- sélection plafonnée à quatre agents pour garder une lecture utilisable ;
- tests purs de sélection, validation et layout.

## Vérification
- syntaxe `src/renderer/app.js`: OK
- tests dédiés comparaison: 4/4 OK
- suite complète: 1256/1270 réussis
- 14 échecs restent liés à l'environnement/dépendances déjà identifiés, sans nouveau test fonctionnel de comparaison en échec.

La sélection de comparaison n'est volontairement pas persistée entre redémarrages : elle décrit une vue temporaire du bureau, pas l'état d'une session.
