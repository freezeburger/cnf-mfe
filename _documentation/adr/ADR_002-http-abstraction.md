# ADR 002 — Couche d'abstraction HTTP centralisée

- Status: Accepted
- Date: 2026-09-29

## Contexte

Les services applicatifs doivent communiquer avec les API via une abstraction unique afin d’éviter la duplication de logique de gestion des erreurs et de cookies, headers, log, et retry.

## Décision

Une abstraction `AppHttpClient` est ajoutée dans `infra/http`. Elle encapsule `HttpClient` et normalise les erreurs HTTP dans un type métier faible couplé à `core/types`.

Cette couche devient le point d’entrée unique pour toutes les requêtes réseau. Les composants et les presenters consomment uniquement des services applicatifs tirant parti de cette abstraction.

## Conséquences

### Avantages
- Gestion cohérente des erreurs HTTP.
- Services métier plus lisibles et plus faciles à tester.
- Possibilité d’ajouter un journal centralisé, des headers standards ou des retraits sans modifier les features.

### Contraintes
- L’abstraction doit rester générique et ne doit pas intégrer des règles métier spécifiques.
- Les erreurs HTTP doivent rester standardisées pour maintenir une API claire.
