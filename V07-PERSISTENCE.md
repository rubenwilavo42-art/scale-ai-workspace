# ScalAI V0.7 — Persistance du bureau

Cette version renforce la restauration du workspace après redémarrage.

## Persisté par workspace
- panneaux et sessions déjà persistés par V0.6 ;
- session active (par position, jamais par identifiant éphémère) ;
- panneau développé ;
- mode Desk/Split ;
- horodatage de la dernière sauvegarde.

## Sécurité de restauration
Les IDs des panneaux sont recréés à chaque démarrage. La restauration utilise donc des positions de panneau et non les anciens IDs.
Les métadonnées invalides retombent sur un état sûr : premier panneau actif, aucun panneau développé et mode Desk.

## Tests
- 4 tests dédiés à la persistance passent.
- syntaxe du main process et du preload vérifiée.
