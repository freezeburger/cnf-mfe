# `http-client`

Abstraction HTTP technique commune aux domaines des microfrontends.

## Responsabilité

`HttpClientService` encapsule `HttpClient` et normalise les erreurs réseau en
`HttpClientError`. Il ne contient aucune URL, aucun DTO métier et aucune règle de domaine.

Les adaptateurs applicatifs restent dans chaque MFE :

- `mfe-products/src/infra/http/products-http.service.ts` valide les produits avec Zod ;
- `mfe-admin/src/infra/http/alerts-http.service.ts` valide les alertes avec Zod.

Cette séparation évite qu'une bibliothèque technique dépende d'un domaine fonctionnel.

## Utilisation

```ts
import { inject, Injectable } from '@angular/core';
import { HttpClientService } from 'http-client';

@Injectable({ providedIn: 'root' })
export class CatalogGateway {
  private readonly http = inject(HttpClientService);

  list() {
    return this.http.get<unknown>('/api/products');
  }
}
```

Le consommateur doit valider la réponse `unknown` avant de l'exposer au domaine.

## Commandes

```bash
npx ng build lib-http-client
npx ng test lib-http-client --watch=false
```
