# Native Federation v4 — points clés et implémentation

Ce guide décrit l'intégration Native Federation v4 du workspace Angular 21 et relie
chaque responsabilité au fichier qui l'implémente.

Documentation de référence :
[Native Federation v4 — Getting Started](https://native-federation.com/docs/v4/getting-started/).

## Vue d'ensemble

```text
Browser
  |
  v
mfe-shell :4200
  |-- federation.manifest.json
  |     |-- mfe-products -> :4201/remoteEntry.json
  |     `-- mfe-admin    -> :4202/remoteEntry.json
  |
  `-- Angular Router
        |-- /products -> mfe-products/Routes
        `-- /admin    -> mfe-admin/Routes
```

Le shell conserve l'URL, la navigation et le layout. Les remotes fournissent des tables de
routes Angular, pas une seconde application racine imbriquée dans le shell.

## 1. Utiliser le builder Native Federation

Les cibles `build` et `serve` des trois applications utilisent
`@angular-architects/native-federation-v4:build`. La compilation Angular standard reste
disponible dans les cibles internes `esbuild` et `serve-original`.

- [Configuration Angular du workspace](../angular.json)
- [Dépendances et scripts npm](../package.json)

Cette séparation permet au builder Native Federation de produire les artefacts Angular,
les `remoteEntry.json`, les modules exposés et les bundles des dépendances partagées.

## 2. Initialiser la fédération avant Angular

Le shell doit résoudre le manifeste et construire l'import map avant que le bootstrap Angular
évalue les dépendances partagées.

1. [`main.ts`](../projects/mfe-shell/src/main.ts) appelle
   `initFederation('federation.manifest.json')`.
2. Le `NativeFederationResult` obtenu est transmis à
   [`bootstrap.ts`](../projects/mfe-shell/src/bootstrap.ts).
3. [`app.config.ts`](../projects/mfe-shell/src/app/app.config.ts) configure Angular et le routeur
   avec ce runtime.

Cette séquence évite d'utiliser un loader global implicite et rend la dépendance au runtime
fédéré explicite.

## 3. Utiliser un manifeste dynamique

Le [manifeste du shell](../projects/mfe-shell/public/federation.manifest.json) associe le nom
logique d'un remote à son `remoteEntry.json` :

```json
{
  "mfe-products": "http://localhost:4201/remoteEntry.json",
  "mfe-admin": "http://localhost:4202/remoteEntry.json"
}
```

Points importants :

- la clé doit correspondre exactement au champ `name` de la configuration du remote ;
- le manifeste est un asset public et peut être remplacé par environnement sans reconstruire
  le shell ;
- un remote indisponible ne doit pas empêcher le shell d'afficher ses routes locales, mais sa
  route distante ne pourra pas être chargée.

## 4. Exposer des routes depuis les remotes

Chaque remote expose `./Routes`, qui pointe vers sa table de routes Angular :

- [Configuration Products](../projects/mfe-products/federation.config.mjs)
- [Routes Products exposées](../projects/mfe-products/src/app/app.routes.ts)
- [Configuration Admin](../projects/mfe-admin/federation.config.mjs)
- [Routes Admin exposées](../projects/mfe-admin/src/app/app.routes.ts)

Exposer des routes plutôt qu'un composant racine permet :

- de conserver le layout du shell ;
- de profiter du lazy loading Angular ;
- de placer des providers au niveau de la frontière de route ;
- de faire fonctionner le remote seul ou sous un préfixe du shell.

## 5. Composer les routes dans le shell

Le [routeur du shell](../projects/mfe-shell/src/app/app.routes.ts) utilise le
`NativeFederationResult` :

```ts
federation
  .as<RemoteRoutes>()
  .loadRemoteModule('mfe-products', './Routes')
  .then((module) => module.routes);
```

Correspondances :

| Route du shell | Remote         | Module exposé |
| -------------- | -------------- | ------------- |
| `/products`    | `mfe-products` | `./Routes`    |
| `/admin`       | `mfe-admin`    | `./Routes`    |

La navigation utilise des `routerLink` dans
[`app.html`](../projects/mfe-shell/src/app/app.html). Il ne faut pas utiliser des URLs externes
vers les ports 4201 et 4202 pour la navigation intégrée.

## 6. Partager Angular et les bibliothèques internes

Les trois fichiers `federation.config.mjs` utilisent `shareAll` avec :

- `singleton: true` pour éviter plusieurs instances Angular ;
- `strictVersion: true` pour refuser des versions incompatibles ;
- `requiredVersion: 'auto'` pour dériver la version du workspace.

Configurations :

- [Shell](../projects/mfe-shell/federation.config.mjs)
- [Products](../projects/mfe-products/federation.config.mjs)
- [Admin](../projects/mfe-admin/federation.config.mjs)

Les `sharedMappings` publient aussi les bibliothèques du workspace :

- `design-system` ;
- `http-client` ;
- `lib-config` ;
- `mfe-sse` ;

Leurs aliases sont déclarés dans le
[tsconfig racine](../tsconfig.json). Un import doit utiliser le même specifier dans les
applications pour être dédupliqué.

### Pourquoi `mfe-sse` doit être singleton

[`MfeSseBridge`](../projects/lib-mfe-sse/src/lib/mfe-sse.ts) porte la connexion `EventSource` et
les signals des événements reçus. Son partage comme singleton permet au shell, à Products et à
Admin d'observer la même connexion et le même dernier message.

## 7. Respecter les frontières d'injection

Un service `providedIn: 'root'` compilé dans un remote n'est pas automatiquement fourni par le
root injector du shell avec les bons tokens locaux.

Les routes distantes fournissent explicitement leurs adaptateurs et services :

- [Providers de route Products](../projects/mfe-products/src/app/app.routes.ts)
- [Providers de route Admin](../projects/mfe-admin/src/app/app.routes.ts)

`lib-config` est partagé comme singleton afin que le provider et le consommateur référencent la
même instance d'`InjectionToken`. Les valeurs restent propres à chaque application :

- [Contrat d'environnement partagé](../projects/lib-config/src/lib/app-environment.ts)
- [Environnement Shell](../projects/mfe-shell/src/environments.ts)
- [Environnement Products](../projects/mfe-products/src/core/config/environment.ts)
- [Environnement Admin](../projects/mfe-admin/src/core/config/environment.ts)

Sans cette identité de token, Angular signale `NG0201: No provider found`.

## 8. Éviter les collisions de composants

Les remotes importent `DesignSystemCard` depuis le même specifier `design-system` :

- [Carte produit](../projects/mfe-products/src/features/products/components/product-card.component.ts)
- [Carte d'alerte](../projects/mfe-admin/src/features/alerts/components/alert-card.component.ts)

Importer la même classe à travers des barrels propres à chaque MFE peut produire deux bundles
distincts et provoquer `NG0912` (collision d'identifiants de composants). Les bibliothèques
partagées doivent être importées via leur point d'entrée public commun.

## 9. Développement local

Lancer un processus par application :

```bash
npm run api
npm run sse
npm run serve:products
npm run serve:admin
npm run serve:shell
```

Ports :

| Service  | Port |
| -------- | ---- |
| API JSON | 3000 |
| SSE      | 3001 |
| Shell    | 4200 |
| Products | 4201 |
| Admin    | 4202 |

Accéder ensuite uniquement au shell :

- `http://localhost:4200/`
- `http://localhost:4200/products`
- `http://localhost:4200/admin`

## 10. Checklist pour ajouter un remote

1. Créer l'application sous `projects/mfe-<domaine>`.
2. Initialiser Native Federation avec un nom et un port uniques.
3. Exposer `./Routes` dans son `federation.config.mjs`.
4. Ajouter son `remoteEntry.json` au manifeste du shell.
5. Ajouter une route `loadChildren` dans le shell.
6. Aligner `shareAll` et les `sharedMappings` avec les autres applications.
7. Fournir les services propres au domaine à la frontière de route.
8. Importer les bibliothèques communes par leurs points d'entrée publics.
9. Construire le remote et le shell.
10. Tester la navigation depuis le shell et vérifier la console navigateur.

## 11. Erreurs fréquentes

| Symptôme                      | Cause probable                          | Vérification                                      |
| ----------------------------- | --------------------------------------- | ------------------------------------------------- |
| Le remote ne charge pas       | nom ou URL du manifeste incorrect       | comparer le manifeste et `name`                   |
| Navigation vers un autre port | lien externe au lieu de `routerLink`    | vérifier le template du shell                     |
| `NG0201`                      | token DI dupliqué ou provider absent    | vérifier les providers de route et mappings       |
| `NG0912`                      | composant partagé bundlé plusieurs fois | utiliser le même point d'entrée public            |
| Plusieurs connexions SSE      | `mfe-sse` non partagé comme singleton   | vérifier les trois configs de fédération          |
| Erreur de version Angular     | dépendances partagées incompatibles     | conserver `strictVersion` et aligner les versions |

## Décisions associées

- [ADR 001 — Architecture shell + microfrontends](./adr/ADR_001-architecture-shell.md)
- [ADR 004 — Frontières des domaines](./adr/ADR_004-feature-domain-boundaries.md)
- [Plan d'architecture technique](./PLAN.md)
