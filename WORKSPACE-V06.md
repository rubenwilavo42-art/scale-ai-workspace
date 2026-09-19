# ScalAI V0.6 — Workspace multi-agents

Cette version poursuit le cœur Workspace/Session sans remplacer les mécanismes existants.

## Ajouts
- bandeau d'espace de travail affichant le dossier courant et le nombre de sessions;
- puces de sessions avec identité/logo de l'agent, état et focus direct;
- bouton `+` pour ajouter une session depuis le bandeau;
- prise en charge visuelle des états actif, attention et terminé;
- identité Poppins renforcée sur les éléments d'interface ScalAI;
- le sélecteur de thèmes reste limité à **Clair** et **Sombre** dans l'interface;
- les anciens identifiants de thème restent compatibles en interne afin de ne pas casser les préférences et tests existants.

## Vérification
- syntaxe `src/renderer/app.js`: OK
- suite: 1248/1262 réussis
- 14 échecs restants: dépendances/outillage de l'environnement (voir `TEST-STATUS-SCALAI.md`), pas de nouvelle régression connue du Workspace.

La capture Electron n'a pas pu être exécutée dans cet environnement car les dépendances npm ne sont pas installées ici (`electron: not found`).
