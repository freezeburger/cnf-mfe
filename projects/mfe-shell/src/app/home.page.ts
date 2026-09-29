/**
 * Landing page for the shell application.
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
      <p class="eyebrow">Platform</p>
      <h2>{{ title() }}</h2>
      <p>Shell Angular orienté micro frontends avec design system partagé et services d'infrastructure.</p>
    </section>
  `,
  styles: `
    .home-shell {
      margin: 2rem auto;
      max-width: 980px;
      padding: 2rem;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(148,163,184,0.28);
      border-radius: 1rem;
      box-shadow: 0 18px 45px rgba(15,23,42,0.06);
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #4f46e5;
      font-weight: 700;
    }

    h2 {
      margin: 0 0 0.75rem;
      font-size: clamp(2rem, 3vw, 3rem);
    }

    p {
      margin: 0;
      line-height: 1.6;
      color: #334155;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly title = signal('Shell Angular + microfrontends');
}
