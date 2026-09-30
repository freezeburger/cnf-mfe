# `mfe-products`

Remote Native Federation responsable du domaine catalogue.

## Fonctionnalités

- lecture des produits avec `resource` ;
- recherche et filtre par catégorie ;
- création avec Signal Forms ;
- validation des DTO avec Zod ;
- séparation CQS entre query et commande ;
- affichage du dernier message SSE partagé.

## Architecture

```text
src/
  core/config/       # lie les valeurs locales au contrat lib-config
  environments.ts    # valeurs d'environnement propres au remote
  infra/http/        # adaptation de http-client vers l'API Products
  features/products/
    models/          # schémas Zod et types inférés
    services/        # query et commandes
    components/      # cartes de produit
    pages/           # route lazy et présentation SSE
    products.presenter.ts
```

`federation.config.mjs` expose `./Routes`. Le shell monte ces routes sous `/products`.

## Démarrage

```bash
npm run api
npm run sse
npm run serve:products
```

Le remote écoute sur `http://localhost:4201`. Il peut fonctionner seul ou être chargé par
le shell sur `http://localhost:4200/products`.
