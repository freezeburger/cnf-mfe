/**
 * Product overview page for the catalog MFE.
 *
 * @example
 * <app-home-page />
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <section class="home-shell">
      <p class="eyebrow">Produits</p>
      <h2>{{ title() }}</h2>
      <ul>
        <li>Catalogue de produits</li>
        <li>Filtres et recherche</li>
        <li>Consolidation des états de données</li>
      </ul>
    </section>
  `,
  styles: `
    .home-shell {
      margin-top: 1.5rem;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(16,185,129,0.18);
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: #0f766e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h2 {
      margin-top: 0;
    }

    ul {
      margin: 1rem 0 0;
      padding-left: 1.25rem;
      line-height: 1.7;
      color: #334155;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly title = signal('Gestion des produits');
}
