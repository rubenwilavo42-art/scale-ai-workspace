# ScalAI — plan de test

## Niveau 1 — tests unitaires/intégration

- détection des agents
- résolution des exécutables
- validation des commandes
- création/fermeture/reprise de sessions
- persistance de l'état
- workspace et garde-fous de chemins
- fichiers et watch
- MCP
- permissions
- rendu markdown

## Niveau 2 — tests UI Electron

- démarrage de l'application
- ouverture d'un workspace
- création de plusieurs tuiles
- lancement simultané de sessions
- fermeture/reprise
- changement de thème
- Library / Browser / Usage / Settings
- menus et raccourcis

## Niveau 3 — agents réels

Pour chaque CLI disponible dans l'environnement :

- détection
- lancement dans un workspace de test
- réception d'une instruction
- sortie visible
- arrêt
- comportement après erreur
- comportement de deux agents simultanés

## Niveau 4 — macOS réel

- Apple Silicon
- Intel
- `.app`
- `.dmg`
- permissions macOS
- Finder / associations de fichiers
- Keychain
- terminal/PTY
- microphone si la fonctionnalité est activée
- signature et notarisation

## Règle de test

Un test qui échoue à cause de l'environnement (ex. outil CLI absent) doit être distingué d'un défaut ScalAI. Il ne doit pas être transformé en succès artificiel.
