# `design-system`

Bibliothèque de primitives visuelles partagées par le shell et les microfrontends.

## Responsabilité

Le design system fournit des composants de présentation sans accès HTTP, état métier ou
connaissance des routes. `DesignSystemCard` définit une carte accessible et cohérente avec :

- `eyebrow`, `title` et `description` comme signal inputs ;
- une zone de contenu projeté ;
- `OnPush` ;
- des styles encapsulés.

## Utilisation

```ts
import { Component } from '@angular/core';
import { DesignSystemCard } from 'design-system';

@Component({
  selector: 'app-summary',
  imports: [DesignSystemCard],
  template: `
    <lib-design-system-card eyebrow="Catalogue" title="Produits" description="État du catalogue">
      <strong>3 références</strong>
    </lib-design-system-card>
  `,
})
export class Summary {}
```

Les applications composent ces primitives. Elles ne doivent pas copier leur implémentation
ni ajouter de logique fonctionnelle dans la bibliothèque.

## Commandes

```bash
npx ng build lib-design-system
npx ng test lib-design-system --watch=false
```
