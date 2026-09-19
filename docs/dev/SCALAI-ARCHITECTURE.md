# ScalAI — architecture de l'application

## Objectif

ScalAI est une application desktop Electron destinée à orchestrer plusieurs agents IA locaux dans un même espace de travail. La cible prioritaire est macOS, avec développement et validation du cœur sur Linux/Windows.

L'interface et les flux fonctionnels suivent volontairement le modèle de l'agent workbench dont ScalAI est un dérivé Apache-2.0. Les éléments de marque de ScalAI restent distincts.

## Architecture

```text
Electron
├── Main process
│   ├── fenêtres / menus
│   ├── workspaces
│   ├── sessions + persistance
│   ├── détection des agents
│   ├── lancement sécurisé des CLI
│   ├── PTY
│   ├── permissions / credentials
│   ├── fichiers / watch
│   ├── MCP / connexions
│   └── navigateur intégré
│
├── Preload
│   └── API IPC minimale et validée
│
└── Renderer
    ├── bureau / tuiles
    ├── sessions agent
    ├── explorateur de fichiers
    ├── éditeur markdown
    ├── Library
    ├── Browser
    ├── Usage
    └── Paramètres
```

## Cycle d'une session

1. L'utilisateur ouvre un dossier.
2. ScalAI détecte les agents CLI disponibles.
3. L'utilisateur crée une session et sélectionne l'agent.
4. Le main process valide l'identité de la commande et le dossier de travail.
5. Un PTY est créé dans le workspace.
6. Le renderer affiche la session dans une tuile.
7. Les sorties du processus sont diffusées vers la tuile.
8. Les événements de permission sont traités explicitement.
9. L'état de la session est conservé pour permettre la reprise après redémarrage lorsque l'agent le permet.

## Principes de sécurité

- Le renderer ne peut pas exécuter arbitrairement une commande système.
- Les commandes d'agent passent par une liste/résolution contrôlée.
- Le workspace courant est la racine de travail par défaut.
- Les accès fichiers hors workspace doivent passer par les contrôles dédiés.
- Les credentials ne sont jamais transmis au renderer sous forme brute.
- Une permission d'exécution doit être explicite lorsqu'une opération le nécessite.

## Tests sans Mac

Le cœur de ScalAI est testé sur l'environnement de développement : parsing, détection, sessions, PTY, IPC, fichiers, permissions, MCP et logique UI testable sans interface graphique.

Les tests spécifiques à macOS seront exécutés ensuite sur un runner/macOS distant : build `.app`, packaging `.dmg`, architecture arm64/x64, Finder, Keychain, permissions et comportement du terminal macOS.

## Étapes de conception

### V0 — socle fonctionnel
- démarrage Electron
- workspace
- tuiles/sessions
- détection CLI
- PTY réel
- persistance

### V0.1 — orchestration
- multi-agents simultanés
- reprise de session
- permissions
- agent master / copies
- MCP

### V0.2 — environnement de travail
- fichiers
- éditeur
- navigateur
- Library
- usage
- paramètres

### V0.3 — distribution macOS
- build arm64
- build Intel
- signature
- notarisation
- installateur
- mise à jour

## Critère de validation

Une fonctionnalité n'est considérée comme terminée que lorsqu'elle est :

1. implémentée ;
2. testée automatiquement lorsque possible ;
3. testée dans le scénario utilisateur correspondant ;
4. validée sur macOS pour les comportements propres à macOS.
