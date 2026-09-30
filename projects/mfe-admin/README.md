# `mfe-admin`

Remote Native Federation responsable de la supervision des alertes.

## Fonctionnalités

- lecture des alertes avec `resource` ;
- validation des DTO avec Zod ;
- filtre de sévérité et compteurs dérivés ;
- presenter dédié à l'orchestration de l'écran ;
- affichage du dernier message SSE partagé.

## Architecture

```text
src/
  core/config/       # lie les valeurs locales au contrat lib-config
  environments.ts    # valeurs d'environnement propres au remote
  infra/http/        # adaptation de http-client vers l'API Alerts
  features/alerts/
    models/          # schémas Zod et types inférés
    services/        # query de lecture
    components/      # cartes d'alerte
    pages/           # route lazy et présentation SSE
    alerts.presenter.ts
```

`federation.config.mjs` expose `./Routes`. Le shell monte ces routes sous `/admin`.

## Démarrage

```bash
npm run api
npm run sse
npm run serve:admin
```

Le remote écoute sur `http://localhost:4202`. Il peut fonctionner seul ou être chargé par
le shell sur `http://localhost:4200/admin`.
