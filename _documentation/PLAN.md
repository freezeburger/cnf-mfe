# Plan d'architecture technique

## Objectif

Construire un workspace Angular 21 structuré en shell + microfrontends, avec une base commune de types, une couche d'accès HTTP centralisée, un design system réutilisable et des routes lazy-loadées.

## Arborescence cible

```text
src/
  app/
    app.config.ts
    app.routes.ts
    app.ts
  core/
    config/
      environment.ts
    services/
      event-bus.ts
      notification.service.ts
    types/
      discriminated.ts
      index.ts
  infra/
    http/
      app-http.service.ts
      index.ts
    sse/
      mfe-sse.service.ts
  share/
    components/
      index.ts
      section-card/
        section-card.ts
  features/
    home/
      home.routes.ts
      home.page.ts
      home.page.html
      home.page.css
  environments.ts
  styles.css
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
- Définir le shell comme point d'entrée unique et dyssocier les microfrontends via routes lazy-loaded.
- Prévoir des intégrations `native-federation` et un contrat d'API stable entre shell et MFE.

## Critères de validation
- Les composants sont standalone et la détection de changements est `OnPush`.
- L'état est géré par des signals.
- La couche HTTP normalize les erreurs HTTP.
- Les routes sont lazy-loaded.
- Les types models sont inférés à partir de schémas Zod.

## Risques et mitigations
- Risque de couplage fort entre MFE → utiliser des interfaces de contrat strictes et des DTOs dédiés.
- Risque de duplication fonctionnelle → centraliser la logique d'accès réseau et de notifications.
- Risque de fuite de logique dans le template → introduire des presenter services dans les features.
