# `mfe-orders`

Remote Native Federation responsable du domaine Orders.

## Fonctionnalités

- lecture des orders avec `resource` ;
- validation des DTO avec Zod ;
- recherche locale orchestrée par un presenter ;
- affichage du dernier message SSE partagé.

## Architecture

```text
src/
  core/config/       # lie les valeurs locales au contrat lib-config
  core/services/     # services applicatifs transverses du remote
  environments.ts    # valeurs d'environnement propres au remote
  share/components/  # barrel des composants réutilisables
  layout/            # chrome propre au MFE
  infra/http/        # adaptation de http-client vers l'API Orders
  features/orders/
    models/          # schémas Zod et types inférés
    services/        # queries (et commandes) métier
    components/      # composants de présentation
    pages/           # route lazy et présentation SSE
    orders.presenter.ts
```

`federation.config.mjs` expose `./Routes`. Le shell monte ces routes sous `/orders`.

## Démarrage

```bash
npm run api
npm run sse
npm run serve:orders
```

Le remote écoute sur `http://localhost:4203`. Il peut fonctionner seul ou être chargé par
le shell sur `http://localhost:4200/orders`.
