import { Routes } from '@angular/router';

import { provideEnvironment } from '@products/core/config/environment';
import { ProductCommandsService } from '@products/features/products/services/product-commands.service';
import { ProductsQueryService } from '@products/features/products/services/products-query.service';
import { ProductsHttpService } from '@products/infra/http/products-http.service';

export const routes: Routes = [
  {
    path: '',
    providers: [
      ...provideEnvironment(),
      ProductsHttpService,
      ProductsQueryService,
      ProductCommandsService,
    ],
    loadComponent: () =>
      import('../features/products/pages/products.page').then((module) => module.ProductsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
