# `mfe-sse`

Bibliothèque Angular partagée qui porte le contrat et l'état de la communication
Server-Sent Events (SSE) de la plateforme.

## Responsabilité

`mfe-sse` est la source de vérité pour :

- le contrat `MfeEvent` ;
- l'ouverture d'une connexion `EventSource` unique ;
- l'état `connected`, les erreurs et les cinq derniers événements sous forme de signals ;
- la validation minimale des messages reçus ;
- l'extraction d'un message présentable avec `getMfeEventMessage`.

La bibliothèque ne connaît ni les URLs d'environnement ni la mise en page des applications.
Chaque application appelle `connect(environment.sseUrl)` et choisit comment présenter le flux.

## Utilisation

```ts
import { Component, inject } from '@angular/core';
import { getMfeEventMessage, MfeSseBridge } from 'mfe-sse';

@Component({
  selector: 'app-live-status',
  template: `<p>{{ message() }}</p>`,
})
export class LiveStatus {
  private readonly sse = inject(MfeSseBridge);

  constructor() {
    this.sse.connect('http://localhost:3001/events');
  }

  message(): string {
    return getMfeEventMessage(this.sse.latestEvent());
  }
}
```

Avec Native Federation, le mapping `mfe-sse` doit rester `singleton` dans le shell et
les remotes. Les composants fédérés observent alors la même connexion et le même signal.

## Contrat d'événement

```ts
interface MfeEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  payload: unknown;
}
```

## Commandes

```bash
npx ng build lib-mfe-sse
npx ng test lib-mfe-sse --watch=false
npm run sse
```

Le serveur local est documenté dans le [README du workspace](../../README.md).
