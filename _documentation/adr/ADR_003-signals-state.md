# ADR 003 — Signals et modèles d’état discriminés

- Status: Accepted
- Date: 2026-09-29

## Contexte

L’application doit être compatible Angular 21, exploiter les signals et maintenir un état de données explicite, lisible et testable.

## Décision

- Les composants utilisent des `signal()` et `computed()`.
- Les états de données passent par des unions discriminées (idle/loading/success/error).
- Les types exposés via `Brand` et `Result` assurent une meilleure expérience développeur et réduisent les erreurs de mutation ou d’intégration.

## Conséquences

### Avantages
- Réduction des bugs de runtime liés aux états non gérés.
- Meilleure lisibilité du flux de données.
- Alignement avec les bonnes pratiques Angular v21.

### Inconvénients
- Dépendance à une discipline stricte sur les états et les transitions.
- Demande une compréhension claire des unions discriminées pour les nouveaux contributeurs.
