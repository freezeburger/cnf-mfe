# ADR 001 — Architecture shell + microfrontends

- Status: Accepted
- Date: 2026-09-29

## Contexte

Le workspace doit exposer un shell d'accueil orienté Native Federation, tout en assurant des microfrontends distincts et réutilisables. Le besoin fonctionnel combine une librairie de composants, du code partagé et des couches d'infrastructure normalisées.

## Décision

Nous adopterons une architecture en couches :

- `core` pour les types, services transverses et configuration
- `infra` pour les dépendances techniques (HTTP, SSE, erreurs)
- `share` pour le design system réutilisable
- `features` pour les domaines métier et les présentations
- `app` pour le shell de routage et la composition des routes lazy-loaded

## Conséquences

### Avantages
- Séparation claire entre domaine et infrastructure.
- Cohérence des règles de typage et des conventions d'API.
- Facilité d’intégration des MFE via des routes lazy-loaded.

### Inconvénients
- Nécessite une discipline stricte de découpage.
- Demande davantage de préparation initiale avant l’ajout de fonctionnalités.
