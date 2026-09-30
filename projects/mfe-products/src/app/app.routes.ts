import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/products/pages/products.page').then((module) => module.ProductsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
