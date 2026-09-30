import { firstValueFrom } from 'rxjs';
import { inject, Injectable, resource } from '@angular/core';

import { OrdersHttpService } from '@orders/infra/http/orders-http.service';

/**
 * Exposes the orders read model through an Angular resource (query side of CQS).
 *
 * @example
 * inject(OrdersQueryService).orders.value();
 */
@Injectable({ providedIn: 'root' })
export class OrdersQueryService {
  private readonly api = inject(OrdersHttpService);

  readonly orders = resource({
    loader: () => firstValueFrom(this.api.list()),
  });
}
