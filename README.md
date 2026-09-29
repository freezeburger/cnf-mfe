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

# Lancer le shell
npx ng serve mfe-shell
```

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
