import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { getMfeEventMessage, MfeSseBridge } from 'mfe-sse';

import { APP_ENVIRONMENT } from '@orders/core/config/environment';
import { OrderCardComponent } from '@orders/features/orders/components';
import { OrdersPresenter } from '@orders/features/orders/orders.presenter';

/**
 * Orders page: lazy-loaded resource query, local search and shared SSE message.
 *
 * @example
 * <app-orders-page />
 */
@Component({
  selector: 'app-orders-page',
  imports: [OrderCardComponent],
  providers: [OrdersPresenter],
  template: `
    <section class="page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Orders</p>
          <h1>Orders</h1>
        </div>
        <button type="button" (click)="presenter.orders.reload()">Actualiser</button>
      </header>

      <section class="live-message" aria-labelledby="orders-live-title" aria-live="polite">
        <h2 id="orders-live-title">Message temps réel</h2>
        <p>{{ eventMessage() }}</p>
      </section>

      <label>
        <span>Rechercher</span>
        <input
          type="search"
          [value]="presenter.search()"
          (input)="presenter.search.set(readValue($event))"
        />
      </label>

      @if (presenter.orders.isLoading()) {
        <p class="feedback" role="status">Chargement…</p>
      } @else if (presenter.orders.error()) {
        <p class="feedback error" role="alert">{{ presenter.loadErrorMessage() }}</p>
      } @else if (presenter.visible().length === 0) {
        <p class="feedback">Aucun élément à afficher.</p>
      } @else {
        <div class="grid">
          @for (item of presenter.visible(); track item.id) {
            <app-order-card [order]="item" />
          }
        </div>
      }
    </section>
  `,
  styles: `
    .page {
      display: grid;
      gap: 1.5rem;
    }
    .page-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
    }
    .eyebrow {
      margin: 0 0 0.35rem;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1,
    h2 {
      margin: 0;
    }
    .live-message {
      display: grid;
      gap: 0.25rem;
      padding: 1rem 1.2rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.8rem;
      background: #fff;
    }
    .live-message h2 {
      font-size: 1rem;
    }
    .live-message p {
      margin: 0;
    }
    label {
      display: grid;
      gap: 0.35rem;
      max-width: 24rem;
      font-weight: 650;
    }
    input {
      min-height: 2.6rem;
      padding: 0.55rem 0.7rem;
      border: 1px solid #94a3b8;
      border-radius: 0.5rem;
      font: inherit;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .feedback {
      margin: 0;
      padding: 1rem;
      border-radius: 0.6rem;
      background: #f1f5f9;
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
      background: #334155;
      color: #fff;
      font: inherit;
      font-weight: 750;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly environment = inject(APP_ENVIRONMENT);
  readonly sse = inject(MfeSseBridge);
  readonly presenter = inject(OrdersPresenter);

  constructor() {
    this.sse.connect(this.environment.sseUrl);
  }

  protected eventMessage(): string {
    return getMfeEventMessage(this.sse.latestEvent());
  }

  protected readValue(event: Event): string {
    return event.target instanceof HTMLInputElement ? event.target.value : '';
  }
}
