import { Routes } from '@angular/router';

import { provideEnvironment } from '@orders/core/config/environment';
import { OrdersQueryService } from '@orders/features/orders/services/orders-query.service';
import { OrdersHttpService } from '@orders/infra/http/orders-http.service';

/** Routes exposed to the shell through Native Federation (`./Routes`). */
export const routes: Routes = [
  {
    path: '',
    providers: [...provideEnvironment(), OrdersHttpService, OrdersQueryService],
    loadComponent: () =>
      import('../features/orders/pages/orders.page').then((module) => module.OrdersPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
