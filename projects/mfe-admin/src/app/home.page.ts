/**
 * Admin overview page for the operations MFE.
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
      <p class="eyebrow">Administration</p>
      <h2>{{ title() }}</h2>
      <ul>
        <li>Suivi des événements</li>
        <li>Gestion des notifications</li>
        <li>Contrôle des alertes fonctionnelles</li>
      </ul>
    </section>
  `,
  styles: `
    .home-shell {
      margin-top: 1.5rem;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(245,158,11,0.18);
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: #b45309;
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
  readonly title = signal('Supervision admin');
}
