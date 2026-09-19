# ScalAI V0.4 — identité + sélection de session

- Interface desktop alignée sur l'identité du site ScalAI.
- Police UI définie sur `Poppins` avec fallback système.
- Terminal et éditeurs conservent leur police monospace.
- Le sélecteur d'apparence expose désormais uniquement deux choix utilisateur : **Clair** et **Sombre**.
- Les anciens thèmes internes restent compatibles pour ne pas casser les préférences existantes.
- Le lanceur de session a été francisé sur les états visibles et conserve la détection/lancement des agents réels.

## Validation

Tests ciblés identité/thèmes/agents : **29/29 réussis**.

La suite complète comporte encore des tests dépendant de l'environnement de développement, notamment ceux qui exigent `/bin/zsh` ou une chaîne de packaging/signature macOS.
