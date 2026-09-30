import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { getMfeEventMessage, MfeSseBridge } from 'mfe-sse';

import { APP_ENVIRONMENT } from '@admin/core/config/environment';
import { AlertsPresenter } from '@admin/features/alerts/alerts.presenter';
import type { AlertSeverity } from '@admin/features/alerts/models/alert.model';
import { AlertCardComponent } from '@admin/features/alerts/components';

/**
 * Alert dashboard with a lazy-loaded resource query and severity filters.
 *
 * @example
 * <app-alerts-page />
 */
@Component({
  selector: 'app-alerts-page',
  imports: [AlertCardComponent],
  providers: [AlertsPresenter],
  template: `
    <section class="page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Centre de contrôle</p>
          <h1>Alertes système</h1>
          <p class="intro">
            Une vue dédiée au suivi des événements opérationnels et de leur criticité.
          </p>
        </div>
        <button class="secondary" type="button" (click)="presenter.alerts.reload()">
          Actualiser
        </button>
      </header>

      <section class="live-message" aria-labelledby="admin-live-title" aria-live="polite">
        <div>
          <p class="eyebrow">SSE partagé</p>
          <h2 id="admin-live-title">Message temps réel</h2>
        </div>
        <p>{{ eventMessage() }}</p>
      </section>

      <section class="summary" aria-label="Synthèse des alertes">
        <article>
          <span>Critiques</span><strong>{{ presenter.criticalCount() }}</strong>
        </article>
        <article>
          <span>À surveiller</span><strong>{{ presenter.warningCount() }}</strong>
        </article>
        <article>
          <span>Total</span><strong>{{ presenter.totalCount() }}</strong>
        </article>
      </section>

      <section class="alert-panel" aria-labelledby="alerts-title">
        <div class="toolbar">
          <h2 id="alerts-title">Événements récents</h2>
          <label>
            <span>Filtrer par sévérité</span>
            <select
              [value]="presenter.selectedSeverity()"
              (change)="presenter.selectedSeverity.set(readSeverity($event))"
            >
              @for (severity of presenter.severities; track severity) {
                <option [value]="severity">{{ severity === 'all' ? 'Toutes' : severity }}</option>
              }
            </select>
          </label>
        </div>

        @if (presenter.alerts.isLoading()) {
          <p class="feedback" role="status">Chargement des alertes…</p>
        } @else if (presenter.alerts.error()) {
          <div class="feedback error" role="alert">
            <p>Les alertes n’ont pas pu être chargées : {{ presenter.loadErrorMessage() }}</p>
            <button class="secondary" type="button" (click)="presenter.alerts.reload()">
              Réessayer
            </button>
          </div>
        } @else if (presenter.visibleAlerts().length === 0) {
          <p class="feedback">Aucune alerte ne correspond à ce filtre.</p>
        } @else {
          <div class="alert-grid">
            @for (alert of presenter.visibleAlerts(); track alert.id) {
              <app-alert-card [alert]="alert" />
            }
          </div>
        }
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      display: grid;
      gap: 1.5rem;
    }
    .page-heading,
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
    }
    .eyebrow {
      margin: 0 0 0.35rem;
      color: #b45309;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1,
    h2 {
      margin: 0;
      color: #0f172a;
    }
    h1 {
      font-size: clamp(2rem, 5vw, 3rem);
    }
    h2 {
      font-size: 1.2rem;
    }
    .intro {
      margin: 0.5rem 0 0;
      color: #475569;
      line-height: 1.55;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.85rem;
    }
    .live-message {
      display: grid;
      grid-template-columns: minmax(11rem, auto) 1fr;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.2rem;
      border: 1px solid #fcd34d;
      border-radius: 0.8rem;
      background: #fffbeb;
    }
    .live-message p {
      margin: 0;
      color: #92400e;
      font-weight: 650;
    }
    .summary article {
      display: grid;
      gap: 0.45rem;
      padding: 1rem 1.2rem;
      border: 1px solid #dbe4ee;
      border-radius: 0.8rem;
      background: #fff;
    }
    .summary span {
      color: #475569;
      font-size: 0.8rem;
      font-weight: 750;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .summary strong {
      color: #0f172a;
      font-size: 1.8rem;
    }
    .alert-panel {
      display: grid;
      gap: 1rem;
      padding: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid #dbe4ee;
      border-radius: 1rem;
      background: #fff;
    }
    label {
      display: grid;
      gap: 0.35rem;
      color: #334155;
      font-size: 0.85rem;
      font-weight: 650;
    }
    select {
      min-height: 2.6rem;
      padding: 0.55rem 0.7rem;
      border: 1px solid #94a3b8;
      border-radius: 0.5rem;
      background: #fff;
      color: #0f172a;
      font: inherit;
    }
    select:focus-visible,
    button:focus-visible {
      outline: 3px solid #fcd34d;
      outline-offset: 2px;
    }
    .alert-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .feedback {
      margin: 0;
      padding: 1rem;
      border-radius: 0.6rem;
      background: #f1f5f9;
      color: #334155;
    }
    .error {
      background: #fef2f2;
      color: #991b1b;
    }
    button {
      min-height: 2.6rem;
      padding: 0.55rem 0.85rem;
      border: 0;
      border-radius: 0.5rem;
      background: #92400e;
      color: #fff;
      font: inherit;
      font-weight: 750;
      cursor: pointer;
    }
    button.secondary {
      background: #334155;
    }
    @media (max-width: 650px) {
      .page-heading,
      .toolbar {
        align-items: start;
        flex-direction: column;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsPage {
  private readonly environment = inject(APP_ENVIRONMENT);
  readonly sse = inject(MfeSseBridge);
  readonly presenter = inject(AlertsPresenter);

  constructor() {
    this.sse.connect(this.environment.sseUrl);
  }

  protected eventMessage(): string {
    return getMfeEventMessage(this.sse.latestEvent());
  }

  protected readSeverity(event: Event): AlertSeverity | 'all' {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : 'all';
    return this.presenter.severities.find((severity) => severity === value) ?? 'all';
  }
}
