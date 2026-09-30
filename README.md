# Workspace Angular 21 — Shell + MFE + design system

## Objectif

Ce workspace est organisé selon une architecture de microfrontends avec shell, deux applications MFE et trois bibliothèques partagées.

## Structure

```text
/projects
  /mfe-shell
  /mfe-products
  /mfe-admin
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

Les frontières de domaine et le choix CQS/`resource` sont détaillés dans [ADR 004](./_documentation/adr/ADR_004-feature-domain-boundaries.md).

## Règles de conception

- `mfe-*` pour les applications front-end isolées
- `lib-*` pour les bibliothèques réutilisables
- `OnPush` et signals dans les composants Angular 21
- routes lazy-loadées dans chaque application
- injection token pour la configuration d’environnement
- services d’infra dans la couche HTTP/SSE
- types stricts, avec schémas Zod pour les modèles de données

## Commandes utiles

```bash
# Construire le shell
npx ng build mfe-shell

# Construire les MFE
npx ng build mfe-products
npx ng build mfe-admin

# Construire les bibliothèques
npx ng build lib-design-system
npx ng build lib-http-client
npx ng build lib-mfe-sse

# Servir chaque application dans un terminal dédié
npm run serve:shell
npm run serve:products
npm run serve:admin

# Démarrer l'API json-server dans un autre terminal pour les MFE
npm run api

# Exécuter les tests des bibliothèques partagées
npx ng test lib-design-system --watch=false
npx ng test lib-http-client --watch=false
npx ng test lib-mfe-sse --watch=false
```

Le shell utilise les URL déclarées dans `src/environments.ts` pour ouvrir les MFE :

- Produits : `http://localhost:4201`
- Administration : `http://localhost:4202`

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
