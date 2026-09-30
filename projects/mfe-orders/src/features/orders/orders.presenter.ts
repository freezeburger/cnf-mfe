import { computed, inject, Injectable, signal } from '@angular/core';

import { OrdersQueryService } from '@orders/features/orders/services/orders-query.service';

/**
 * Coordinates the orders query and the local search of the page.
 *
 * @example
 * providers: [OrdersPresenter]
 */
@Injectable()
export class OrdersPresenter {
  private readonly query = inject(OrdersQueryService);

  readonly orders = this.query.orders;
  readonly search = signal('');
  readonly all = computed(() => (this.orders.hasValue() ? this.orders.value() : []));
  readonly visible = computed(() => {
    const term = this.search().trim().toLowerCase();
    return term
      ? this.all().filter((item) => item.title.toLowerCase().includes(term))
      : this.all();
  });
  readonly loadErrorMessage = computed(() => {
    const error = this.orders.error();
    return error instanceof Error ? error.message : 'Erreur inconnue lors du chargement.';
  });
}
