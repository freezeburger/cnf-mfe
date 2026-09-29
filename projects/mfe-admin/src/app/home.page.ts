/**
 * Admin overview page for the operations MFE.
 *
 * @example
 * <app-home-page />
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SectionCard } from '@share/components';

import type { Alert } from '@core/types';

const alertsSeed: Alert[] = [
  {
    id: 'a-1',
    title: 'SLA production',
    severity: 'warning',
    message: 'Le taux de disponibilité est légèrement sous la cible du trimestre.',
  },
  {
    id: 'a-2',
    title: 'Journalisation',
    severity: 'info',
    message: 'Deux événements ont été ingérés depuis la dernière synchronisation.',
  },
];

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SectionCard],
  template: `
    <section class="home-shell">
      <p class="eyebrow">Administration</p>
      <h2>{{ title() }}</h2>

      <div class="stats-grid">
        <article class="stat">
          <span class="label">Alertes actives</span>
          <strong>{{ alerts.length }}</strong>
        </article>
        <article class="stat">
          <span class="label">Flux supervisés</span>
          <strong>14</strong>
        </article>
        <article class="stat">
          <span class="label">Disponibilité</span>
          <strong>99.8%</strong>
        </article>
      </div>

      <div class="card-grid">
        @for (alert of alerts; track alert.id) {
          <app-section-card [title]="alert.title" [description]="alert.message" [eyebrow]="alert.severity">
            <span class="severity" [class.warning]="alert.severity === 'warning'" [class.critical]="alert.severity === 'critical'">
              {{ alert.severity }}
            </span>
          </app-section-card>
        }
      </div>
    </section>
  `,
  styles: `
    .home-shell {
      margin-top: 1.5rem;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255,255,255,0.82);
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
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat {
      padding: 1rem 1.25rem;
      border-radius: 1rem;
      background: #fff7ed;
      border: 1px solid rgba(251, 146, 60, 0.2);
      display: grid;
      gap: 0.4rem;
    }

    .label {
      color: #9a5b00;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.72rem;
      font-weight: 700;
    }

    strong {
      font-size: 1.6rem;
      color: #1f2937;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .severity {
      display: inline-flex;
      padding: 0.3rem 0.65rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      background: #e0f2fe;
      color: #0f172a;
    }

    .warning {
      background: #fef3c7;
      color: #92400e;
    }

    .critical {
      background: #fee2e2;
      color: #991b1b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly title = signal('Supervision admin');
  readonly alerts = alertsSeed;
}
