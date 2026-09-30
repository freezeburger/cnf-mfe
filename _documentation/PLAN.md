# Plan d'architecture technique

## Objectif

Construire un workspace Angular 21 structuré en shell + microfrontends, avec une base commune de types, une couche d'accès HTTP centralisée, un design system réutilisable et des routes lazy-loadées.

Guide d'implémentation :
[Native Federation v4 — points clés et code associé](./NATIVE_FEDERATION.md).

## Arborescence cible

```text
projects/
  mfe-products/src/
    core/config/
    share/components/
    layout/
    infra/http/
    features/products/
      models/
      services/
      components/
      pages/
      products.presenter.ts
  mfe-admin/src/
    core/config/
    share/components/
    layout/
    infra/http/
    features/alerts/
      models/
      services/
      components/
      pages/
      alerts.presenter.ts
server/
  db.json
```

## Phases

### 1. Fondation et conventions

- Mettre en place les conventions Angular v21, les InjectionToken, le typage strict, les routes lazy-loadées et les services d'infrastructure.
- Introduire un système de types disriminants pour l'état de données et les erreurs.

### 2. Couche applicative

- Centraliser l'accès HTTP dans `infra/http` avec gestion globalisée des erreurs.
- Préparer le support `MfeSseCommunicator` dans `infra/sse` pour les échanges inter-MFE.
- Créer les `core/services` pour l'événementiel, les notifications et les services transverses.

### 3. Design system et expérience utilisateur

- Produire des composants graphiques dans `share/components` avec API simple et réutilisable.
- Maintenir une séparation claire entre orchestration de vue et logique métier dans les features.

### 4. MFE et shell

- Définir le shell comme point d'entrée unique et découpler les microfrontends via des routes lazy-loaded.
- Exposer `./Routes` depuis chaque MFE avec Native Federation v4.
- Charger les routes distantes depuis le manifeste dynamique du shell avec le résultat de `initFederation` injecté au bootstrap.

## Critères de validation

- Les composants sont standalone et la détection de changements est `OnPush`.
- Les lectures asynchrones utilisent `resource`, les valeurs dérivées `computed`, et le formulaire produit Signal Forms (expérimentales sous Angular 21).
- La couche HTTP normalize les erreurs HTTP.
- Les routes sont lazy-loaded.
- La navigation reste sur le domaine du shell pendant le chargement des routes fédérées.
- Les types models sont inférés à partir de schémas Zod.
- Les commands d'écriture sont séparées des queries de lecture (CQS).

## Risques et mitigations

- Risque de couplage fort entre MFE → utiliser des interfaces de contrat strictes et des DTOs dédiés.
- Risque de duplication fonctionnelle → centraliser la logique d'accès réseau et de notifications.
- Risque de fuite de logique dans le template → introduire des presenter services dans les features.
