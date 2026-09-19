# ScalAI — état des tests

Dernière batterie après V0.8 : **1256/1270 réussis**, 14 échecs.

Les 14 échecs restants sont des dépendances/outils de l'environnement de validation actuel et non des échecs introduits par le module de comparaison multi-agents. Ils concernent notamment des outils shell (`zsh`), des services/modules optionnels et des contrôles de packaging/macOS.

## V0.8
- `node --check src/renderer/app.js` : OK
- tests `multi-agent-workspace.test.mjs` : **4/4 OK**
- sélection multi-agents : 2 à 4 sessions
- vue de comparaison : 2 colonnes, responsive
- les sessions non sélectionnées restent montées afin de préserver leur PTY
