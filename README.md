# ScalAI

ScalAI est un espace de travail de bureau pour agents IA, conçu pour macOS. Il permet d’ouvrir un dossier, de détecter les agents installés sur la machine et de faire travailler plusieurs sessions en parallèle dans le même espace.

## Fonctionnement

1. Ouvrez un dossier de travail.
2. ScalAI détecte les agents disponibles sur votre Mac.
3. Créez une session et choisissez l’agent qui l’exécute.
4. L’agent travaille dans le dossier sélectionné et ses sorties restent visibles dans sa propre tuile.
5. Plusieurs sessions peuvent fonctionner simultanément.

Le modèle est local-first : ScalAI orchestre les outils/CLI d’agents présents sur votre Mac au lieu de remplacer leurs comptes ou abonnements.

## Développement

```bash
npm install
npm start
```

Créer une version macOS :

```bash
npm run dist
```

## Licence

ScalAI est un dérivé du projet Nami, distribué sous Apache License 2.0. Voir `LICENSE` et `NOTICE-SCALAI.txt`.

## Test local sans compte IA

ScalAI inclut un agent de développement optionnel, `ScalAI Test Agent`, uniquement pour valider le cycle workspace → session → PTY → arrêt sans compte fournisseur.

```bash
export SCALAI_DEV_AGENT=1
export PATH="$PWD/bin:$PATH"
npm start
```

L'agent n'est pas exposé en production et ne fait aucun appel réseau. Il sert à valider l'intégration desktop avant de brancher Claude Code, Codex ou un autre agent réel.

## ScalAI workspace session core

Cette version renforce le cœur du bureau :

- sessions agents/terminal réelles dans le workspace courant ;
- états explicites `running`, `working`, `attention`, `stopping`, `exited` et `finished` ;
- arrêt d’une session depuis son panneau ;
- relance d’une session terminée en conservant son identité de workspace/agent ;
- duplication d’une session en créant une nouvelle conversation, sans réutiliser les identifiants de reprise ;
- actions accessibles depuis le menu contextuel du panneau ;
- prise en charge du cycle d’arrêt/reprise pour les sessions ACP ;
- tests unitaires du cycle de vie des sessions.

### Validation locale

La suite dédiée au cycle de vie passe à **3/3**. La suite complète actuelle contient 1262 tests, dont 1243 passent dans l’environnement de validation disponible. Les 19 échecs restants sont des tests préexistants dépendant notamment de `zsh`, du packaging/notarisation Electron, de services ou d’outils non présents dans cet environnement ; ils ne sont pas utilisés comme preuve de validation macOS.

Le code principal et les nouveaux modules passent également la vérification syntaxique Node.

## V1.0 — Permissions et sécurité

Les lancements d'agents sont désormais soumis au contrôle du processus principal : workspace vérifié, commande affichée et décision utilisateur (une fois / session / refus). Les credentials restent hors du renderer et sont accordés uniquement selon la politique de l'agent.

--- V1.6 AUDIT ---
V1.6 ajoute la campagne de tests et le rapport d audit.
