# Workspace Angular 21 — Shell + MFE + design system

## Objectif

Ce workspace est organisé selon une architecture de microfrontends avec shell, trois applications MFE et quatre bibliothèques partagées.

## Structure

```text
/projects
  /mfe-shell
  /mfe-products
  /mfe-admin
  /mfe-orders
  /lib-config
  /lib-design-system
  /lib-http-client
  /lib-mfe-sse
```

Chaque MFE suit la même séparation par responsabilité dans son `src/` :

```text
src/
  core/                  # configuration et services applicatifs
  share/components/      # barrel des composants réutilisables
  layout/                # chrome propre au MFE
  infra/http/            # adaptateurs API appuyés sur lib-http-client
  features/<domaine>/
    models/              # schémas Zod et types inférés
    services/            # queries et commandes métier
    components/          # composants de présentation
    pages/               # pages lazy-loadées
    *.presenter.ts       # orchestration de l'écran
```

Exemples implémentés :

- `mfe-products` : recherche et filtre du catalogue, lecture par `resource`, commande de création séparée, schéma Zod, presenter et formulaire Signal Forms.
- `mfe-admin` : supervision d'alertes, filtre par sévérité et compteurs dérivés via `computed`.
- `mfe-orders` : commandes, généré par `npm run generate:mfe -- orders` (squelette standard avec recherche et message SSE).

Les frontières de domaine et le choix CQS/`resource` sont détaillés dans [ADR 004](./_documentation/adr/ADR_004-feature-domain-boundaries.md).

## Règles de conception

- `mfe-*` pour les applications front-end isolées
- `lib-*` pour les bibliothèques réutilisables
- Native Federation v4 pour charger les routes distantes dans le routeur du shell
- `OnPush` et signals dans les composants Angular 21
- routes lazy-loadées dans chaque application
- injection token pour la configuration d’environnement
- services d’infra dans la couche HTTP/SSE
- types stricts, avec schémas Zod pour les modèles de données

## Frontières et responsabilités

Il existait une dualité SSE entre `src/infra/sse` et `projects/lib-mfe-sse` : la bibliothèque
ouvrait `EventSource`, tandis qu'un service racine conservait les événements. Cette responsabilité
est désormais entièrement portée par `lib-mfe-sse`.

La règle appliquée est :

| Emplacement                   | Responsabilité                                                 |
| ----------------------------- | -------------------------------------------------------------- |
| `projects/lib-*`              | primitives techniques ou visuelles réutilisables, sans domaine |
| `projects/mfe-*/src/infra`    | adaptation d'une primitive technique à un domaine              |
| `projects/mfe-*/src/features` | modèles, règles, état et présentation du domaine               |
| `projects/mfe-shell`          | orchestration, navigation et chrome global                     |
| `projects/lib-config`         | contrat et token d'environnement partagés                      |

Le workspace ne possède plus de dossier `/src` racine. Chaque source appartient explicitement à
une application ou une bibliothèque sous `projects/`. Les valeurs d'environnement concrètes
restent dans le `src/environments.ts` de chaque application ; `lib-config` ne fournit que le
contrat et l'`InjectionToken` partagés.

## Commandes utiles

```bash
# Construire le shell
npx ng build mfe-shell

# Construire les MFE
npx ng build mfe-products
npx ng build mfe-admin
npx ng build mfe-orders

# Construire les bibliothèques
npx ng build lib-design-system
npx ng build lib-http-client
npx ng build lib-mfe-sse
npx ng build lib-config

# Générer un nouveau MFE standardisé (voir « Ajouter un nouveau MFE »)
npm run generate:mfe -- invoices

# Servir chaque application dans un terminal dédié
npm run serve:shell
npm run serve:products
npm run serve:admin
npm run serve:orders

# Démarrer l'API json-server dans un autre terminal pour les MFE
npm run api

# Démarrer le serveur d'événements SSE
npm run sse

# Exécuter les tests des bibliothèques partagées
npx ng test lib-design-system --watch=false
npx ng test lib-http-client --watch=false
npx ng test lib-mfe-sse --watch=false
npx ng test lib-config --watch=false
```

Le shell reste l'unique URL de navigation. Son routeur charge les routes exposées par Native Federation :

- `/products` charge `mfe-products/Routes` depuis `http://localhost:4201/remoteEntry.json`
- `/admin` charge `mfe-admin/Routes` depuis `http://localhost:4202/remoteEntry.json`
- `/orders` charge `mfe-orders/Routes` depuis `http://localhost:4203/remoteEntry.json`

Les URL de remotes sont déclarées dans `projects/mfe-shell/public/federation.manifest.json` et peuvent être remplacées au déploiement sans reconstruire le shell.

## Ajouter un nouveau MFE

Un MFE est une application Angular indépendante chargée par `mfe-shell` avec Native
Federation. Pour ajouter un domaine `invoices` (à remplacer par le nom réel du domaine), suivre
les étapes suivantes. Pour créer le MFE sans le générateur, voir [Ajout manuel](#ajout-manuel).

### 1. Générer le MFE

Depuis la racine du workspace, lancer le générateur avec le nom du domaine en kebab-case (sans
le préfixe `mfe-`) :

```bash
npm run generate:mfe -- invoices
```

Options disponibles :

| Option            | Rôle                                            | Défaut                           |
| ----------------- | ----------------------------------------------- | -------------------------------- |
| `--entity <nom>`  | nom de l'entité du modèle (kebab-case)          | domaine au singulier (`invoice`) |
| `--label <texte>` | libellé affiché dans le shell et les pages      | domaine en titre (`Invoices`)    |
| `--port <numéro>` | port local du remote                            | plus grand port utilisé + 1      |
| `--dry-run`       | affiche les fichiers créés/modifiés sans écrire | —                                |

```bash
npm run generate:mfe -- customer-invoices --entity invoice --label "Factures" --port 4210
```

Le script refuse un domaine réservé, un dossier, un alias ou un port déjà existant.

### 2. Arborescence générée

Le générateur pose la structure standard d'un MFE, sur le modèle de `mfe-admin` :

```text
projects/mfe-invoices/
  federation.config.mjs          # remote Native Federation v4, expose ./Routes
  README.md
  tsconfig.app.json / tsconfig.spec.json
  public/favicon.ico
  src/
    index.html, main.ts, bootstrap.ts, styles.css
    environments.ts              # apiBaseUrl, sseUrl (contrat lib-config)
    app/
      app.ts, app.config.ts
      app.routes.ts              # routes lazy exposées au shell
    core/config/environment.ts   # provideEnvironment() + APP_ENVIRONMENT
    core/services/index.ts       # services applicatifs du remote
    share/components/index.ts    # barrel (DesignSystemCard)
    layout/app-layout.component.ts
    infra/http/invoices-http.service.ts        # HttpClientService + validation Zod
    features/invoices/
      models/invoice.model.ts                  # schéma Zod + type inféré
      services/invoices-query.service.ts       # query CQS via resource()
      components/invoice-card.component.ts     # présentation (+ barrel index.ts)
      pages/invoices.page.ts                   # page lazy, recherche, message SSE
      invoices.presenter.ts                    # état signal et dérivés computed
      index.ts
```

La page se connecte au flux partagé avec `MfeSseBridge` (`lib-mfe-sse`) et affiche le dernier
message SSE, comme Products et Admin. Tous les composants sont standalone et `OnPush`.

### 3. Enregistrements automatiques

Le script met également à jour, en conservant leur mise en forme :

| Fichier                                              | Modification                                 |
| ---------------------------------------------------- | -------------------------------------------- |
| `angular.json`                                       | projet `mfe-invoices` (builders federation)  |
| `tsconfig.json`                                      | alias `@invoices/*` et référence du projet   |
| `package.json`                                       | script `serve:invoices` sur le port attribué |
| `server/db.json`                                     | collection `invoices` avec un exemple        |
| `projects/mfe-shell/public/federation.manifest.json` | URL du `remoteEntry.json`                    |
| `projects/mfe-shell/src/app/app.routes.ts`           | route `/invoices` via `loadRemoteModule`     |
| `projects/mfe-shell/src/app/app.html`                | lien de navigation                           |

Le nom passé à `loadRemoteModule` est identique au `name` de `federation.config.mjs` et à la
clé du manifest : ces trois valeurs doivent rester synchronisées si elles sont modifiées.

### 4. Adapter le domaine

Le code généré est un point de départ fonctionnel. Adapter ensuite :

- le schéma Zod `models/invoice.model.ts` et les données de `server/db.json` ;
- l'adaptateur `infra/http/invoices-http.service.ts` si l'API diffère ;
- les commandes métier (écriture) dans `services/`, séparées des queries ;
- les composants de présentation et la page ;
- le `README.md` du MFE.

### 5. Vérifier l'intégration

Construire puis démarrer l'API, le SSE, le nouveau remote et le shell dans des terminaux séparés :

```bash
npx ng build mfe-invoices
npm run api
npm run sse
npm run serve:invoices
npm run serve:shell
```

Vérifier les points suivants :

1. `http://localhost:4204/remoteEntry.json` est accessible ;
2. `http://localhost:4200/invoices` affiche le MFE sans erreur de chargement fédéré ;
3. la navigation directe et le rechargement de `/invoices` fonctionnent ;
4. les appels HTTP, les erreurs et les événements SSE utilisent les bibliothèques partagées ;
5. `npx ng build mfe-shell` et `npx ng build mfe-invoices` réussissent.

### Ajout manuel

Sans le générateur, créer le MFE avec l'Angular CLI et le schematic Native Federation v4, puis
l'aligner sur la structure du workspace. L'exemple utilise `invoices` sur le port `4204`.

#### 1. Générer l'application

```bash
npx ng generate application mfe-invoices --routing --style css --skip-tests --ssr false --prefix app
```

La commande crée `projects/mfe-invoices/`, déclare le projet dans `angular.json` et ajoute sa
référence dans `tsconfig.json`.

#### 2. Transformer l'application en remote

```bash
npx ng generate @angular-architects/native-federation-v4:init --project mfe-invoices --port 4204 --type remote
```

Le schematic remplace les builders par ceux de Native Federation (`build`, `serve`, `esbuild`,
`serve-original` sur le port `4204`), crée `federation.config.mjs` et `src/bootstrap.ts`, et
réécrit `src/main.ts` avec `initFederation`.

Compléter ensuite `federation.config.mjs`, comme dans `mfe-admin` :

```js
exposes: {
  './Routes': './projects/mfe-invoices/src/app/app.routes.ts', // remplace './Component'
},

sharedMappings: [
  [
    ['design-system', 'http-client', 'lib-config', 'mfe-sse'],
    { includeSecondaries: { keepAll: true } },
  ],
],
```

Ajouter l'alias du projet dans `tsconfig.json` :

```jsonc
"paths": {
  "@invoices/*": ["projects/mfe-invoices/src/*"],
  // ...
}
```

#### 3. Générer la structure du domaine

Depuis la racine du workspace :

```bash
# Page lazy, composant de présentation et layout (OnPush, template inline)
npx ng g component invoices --project mfe-invoices --path projects/mfe-invoices/src/features/invoices/pages --flat --type page --change-detection OnPush --inline-template --inline-style --skip-tests
npx ng g component invoice-card --project mfe-invoices --path projects/mfe-invoices/src/features/invoices/components --flat --type component --change-detection OnPush --inline-template --inline-style --skip-tests
npx ng g component app-layout --project mfe-invoices --path projects/mfe-invoices/src/layout --flat --type component --selector app-layout --change-detection OnPush --inline-template --inline-style --skip-tests

# Adaptateur HTTP, query CQS et presenter
npx ng g service invoices-http --project mfe-invoices --path projects/mfe-invoices/src/infra/http --type service --skip-tests
npx ng g service invoices-query --project mfe-invoices --path projects/mfe-invoices/src/features/invoices/services --type service --skip-tests
npx ng g service invoices --project mfe-invoices --path projects/mfe-invoices/src/features/invoices --type presenter --skip-tests
```

Créer à la main les fichiers sans schematic :

| Fichier                                         | Contenu                                              |
| ----------------------------------------------- | ---------------------------------------------------- |
| `src/environments.ts`                           | `AppEnvironment` (`appName`, `apiBaseUrl`, `sseUrl`) |
| `src/core/config/environment.ts`                | copie de `mfe-admin` (`provideEnvironment`)          |
| `src/features/invoices/models/invoice.model.ts` | schéma Zod et type `z.infer`                         |
| `src/features/invoices/components/index.ts`     | barrel des composants                                |
| `src/features/invoices/index.ts`                | barrel public du domaine                             |
| `src/share/components/index.ts`                 | réexport des composants de `design-system`           |

#### 4. Implémenter le remote

- `src/app/app.config.ts` : ajouter `provideHttpClient()` et `...provideEnvironment()` ;
- `src/app/app.html` : remplacer la page d'exemple du CLI par `<app-layout />` (ou `<router-outlet />`) ;
- `invoices-http.service.ts` : `HttpClientService` de `http-client`, URL issue de
  `APP_ENVIRONMENT`, réponse validée par le schéma Zod ;
- `invoices-query.service.ts` : lecture exposée par `resource()`, commandes dans un service séparé ;
- `invoices.presenter.ts` : retirer `providedIn: 'root'`, exposer l'état avec `signal` et `computed`,
  et le fournir dans `providers` de la page ;
- `invoices.page.ts` : injecter le presenter et connecter le flux SSE partagé :

```ts
private readonly environment = inject(APP_ENVIRONMENT);
readonly sse = inject(MfeSseBridge);

constructor() {
  this.sse.connect(this.environment.sseUrl);
}

protected eventMessage(): string {
  return getMfeEventMessage(this.sse.latestEvent());
}
```

Déclarer enfin les routes exposées dans `src/app/app.routes.ts` :

```ts
export const routes: Routes = [
  {
    path: '',
    providers: [...provideEnvironment(), InvoicesHttpService, InvoicesQueryService],
    loadComponent: () =>
      import('../features/invoices/pages/invoices.page').then((module) => module.InvoicesPage),
  },
  { path: '**', redirectTo: '' },
];
```

#### 5. Brancher le workspace et le shell

- `package.json` : `"serve:invoices": "ng serve mfe-invoices --port 4204"` ;
- `server/db.json` : collection `"invoices": [...]` pour json-server ;
- `projects/mfe-shell/public/federation.manifest.json` :
  `"mfe-invoices": "http://localhost:4204/remoteEntry.json"` ;
- `projects/mfe-shell/src/app/app.routes.ts` : route avant le wildcard `**` ;

```ts
{
  path: 'invoices',
  loadChildren: () =>
    federation
      .as<RemoteRoutes>()
      .loadRemoteModule('mfe-invoices', './Routes')
      .then((module) => module.routes),
},
```

- `projects/mfe-shell/src/app/app.html` : `<a routerLink="/invoices">Factures</a>` dans la `nav`.

Terminer par les vérifications de l'[étape 5](#5-vérifier-lintégration).

## Communication SSE

Le serveur local expose `GET http://localhost:3001/events`. Le shell s'y abonne au démarrage
avec `lib-mfe-sse` et affiche l'état de la connexion ainsi que les cinq derniers événements,
y compris pendant la navigation entre les MFE.

Le serveur envoie immédiatement `system.connected`, puis un `system.message` toutes les cinq
secondes. Le shell, Products et Admin observent la même instance fédérée de `MfeSseBridge` et
affichent donc le même dernier message. Un MFE ou un service backend peut publier un événement
métier avec :

```bash
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{"type":"product.updated","source":"mfe-products","payload":{"id":"p-1001"}}'
```

Les Signal Forms du formulaire produit sont expérimentales dans Angular 21. Elles illustrent le modèle signal demandé, mais leur stabilité doit être réévaluée avant une mise en production.

## Prompts utiles pour le développement

- "Crée un composant de liste de produits avec filtering et signal state."
- "Ajoute une abstraction HTTP dédiée avec gestion d’erreurs et schéma Zod pour les DTOs."
- "Réalise un service presenter pour le MFE admin avec observables et gestion de l’état."
- "Implémente un composant de design system réutilisable avec API typée et accessibilité.”

## Bonnes pratiques

- Séparer les domaines dans les features et garder un Presenter Service si le composant devient complexe.
- Préférer les composants standalone
- Centraliser les erreurs HTTP dans les abstractions `lib-http-client`
- Utiliser un mécanisme de communication MFE par `lib-mfe-sse`
- Documenter les API via TSDoc et `@example`
