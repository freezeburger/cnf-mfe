# ADR 004 — Domaines métier isolés par MFE

- Status: Accepted
- Date: 2026-09-30

## Contexte

Les exemples shell et MFE doivent montrer comment appliquer l'arborescence recommandée à des fonctionnalités métier réelles, sans confondre composants partagés, infrastructure et règles de domaine.

## Décision

- Chaque MFE organise son code dans `core`, `share`, `layout`, `infra` et `features`.
- Chaque domaine regroupe ses modèles Zod, services, composants, pages et presenter sous `features/<domaine>`.
- Les adaptateurs HTTP restent dans `infra/http` et s'appuient sur `lib-http-client`.
- Les services de lecture exposent un `resource`; les commandes d'écriture restent séparées (CQS).
- Les routes des domaines utilisent `loadComponent`.
- Le formulaire produit utilise Signal Forms comme exemple pédagogique, avec la validation du modèle persisté confirmée par Zod.
- L'API locale de démonstration est servie par `json-server`.

## Exemples

- `mfe-products` implémente le catalogue, le filtrage, la lecture asynchrone et la création de produits.
- `mfe-admin` implémente une supervision d'alertes avec métriques et filtre par sévérité.

## Conséquences

### Avantages

- Les règles métier sont faciles à localiser et à tester par domaine.
- Les MFE conservent leurs contrats et composants spécifiques sans les placer dans une couche globale prématurément.
- La séparation query/command facilite le remplacement ultérieur de la source de données.

### Inconvénients

- Certains adaptateurs et modèles de chaque MFE peuvent se ressembler sans être partageables ; une extraction commune ne doit se faire qu'après stabilisation de leurs contrats.
- Signal Forms est expérimentale dans Angular 21 et nécessite une réévaluation avant une utilisation en production.
