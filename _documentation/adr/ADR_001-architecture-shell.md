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

La composition des applications utilise Native Federation v4 :

- `mfe-products` et `mfe-admin` exposent leur table `./Routes`.
- Le shell est un `dynamic-host` et résout les `remoteEntry.json` depuis `federation.manifest.json`.
- Le résultat de `initFederation` est transmis explicitement au bootstrap Angular puis aux routes.
- `/products` et `/admin` utilisent `loadChildren` ; l'URL et le layout du shell sont conservés.

## Conséquences

### Avantages

- Séparation claire entre domaine et infrastructure.
- Cohérence des règles de typage et des conventions d'API.
- Facilité d’intégration des MFE via des routes lazy-loaded.

### Inconvénients

- Nécessite une discipline stricte de découpage.
- Demande davantage de préparation initiale avant l’ajout de fonctionnalités.
