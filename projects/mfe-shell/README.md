# `mfe-shell`

Hôte dynamique Native Federation v4 et unique point d'entrée utilisateur.

## Responsabilités

- initialiser la fédération depuis `public/federation.manifest.json` ;
- posséder la navigation et le chrome global ;
- charger `mfe-products/Routes` et `mfe-admin/Routes` avec `loadChildren` ;
- démarrer la connexion SSE partagée et afficher l'historique global.

Le shell ne contient pas les règles métier Products ou Admin.

## Démarrage

```bash
npm run serve:shell
```

Le shell écoute sur `http://localhost:4200`. Les deux remotes doivent être démarrés pour
que toutes les routes soient disponibles.

## Points d'entrée

- `src/main.ts` : initialise Native Federation avant Angular ;
- `src/bootstrap.ts` : démarre Angular avec le runtime fédéré ;
- `src/app/app.routes.ts` : compose les routes locales et distantes ;
- `src/app/app.ts` : initialise le flux SSE partagé ;
- `src/environments.ts` : fournit les valeurs du shell au contrat `lib-config`.
