/**
 * Landing page for the shell application.
 *
 * @example
 * <app-home-page />
 */
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { APP_ENVIRONMENT } from '@core/config/environment';
import { SectionCard } from '@share/components';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SectionCard],
  template: `
    <section class="home-shell">
      <p class="eyebrow">{{ appName() }}</p>
      <h2>{{ title() }}</h2>
      <p class="lead">Shell Angular orienté micro frontends avec design system partagé et services d'infrastructure.</p>

      <div class="card-grid">
        <app-section-card title="Shell" description="Le shell centralise la navigation et l'orchestration des MFE." eyebrow="Architecture">
          <strong>Routage lazy-loaded</strong>
        </app-section-card>
        <app-section-card title="Design System" description="Les composants partagés garantissent un langage visuel cohérent." eyebrow="UI kit">
          <strong>Composants réutilisables</strong>
        </app-section-card>
        <app-section-card title="Observabilité" description="Le flux SSE et le bus d'événements assurent la propagation des notifications." eyebrow="Infra">
          <strong>{{ status() }}</strong>
        </app-section-card>
      </div>
    </section>
  `,
  styles: `
    .home-shell {
      margin: 2rem auto;
      max-width: 1100px;
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

    .lead {
      margin: 0 0 1.5rem;
      line-height: 1.6;
      color: #334155;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    strong {
      color: #1e293b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly environment = inject(APP_ENVIRONMENT);

  readonly appName = signal(this.environment.appName);
  readonly title = signal('Shell Angular + microfrontends');
  readonly status = signal('Bus SSE prêt');
}
