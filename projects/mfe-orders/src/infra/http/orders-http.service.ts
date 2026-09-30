import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { HttpClientService } from 'http-client';

import { APP_ENVIRONMENT } from '@orders/core/config/environment';
import {
  orderListSchema,
  type Order,
} from '@orders/features/orders/models/order.model';

/**
 * Adapts the shared HTTP client to the orders API and validates its payloads.
 *
 * @example
 * inject(OrdersHttpService).list();
 */
@Injectable({ providedIn: 'root' })
export class OrdersHttpService {
  private readonly client = inject(HttpClientService);
  private readonly environment = inject(APP_ENVIRONMENT);

  list(): Observable<Order[]> {
    return this.client
      .get<unknown>(`${this.environment.apiBaseUrl}/orders`)
      .pipe(map((response) => orderListSchema.parse(response)));
  }
}
