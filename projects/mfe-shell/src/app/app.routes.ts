import { Routes } from '@angular/router';
import type { NativeFederationResult } from '@angular-architects/native-federation-v4';

interface RemoteRoutes {
  routes: Routes;
}

export function routes(federation: NativeFederationResult): Routes {
  return [
    {
      path: '',
      pathMatch: 'full',
      loadComponent: () => import('./home.page').then((module) => module.HomePage),
    },
    {
      path: 'products',
      loadChildren: () =>
        federation
          .as<RemoteRoutes>()
          .loadRemoteModule('mfe-products', './Routes')
          .then((module) => module.routes),
    },
    {
      path: 'admin',
      loadChildren: () =>
        federation
          .as<RemoteRoutes>()
          .loadRemoteModule('mfe-admin', './Routes')
          .then((module) => module.routes),
    },
    {
      path: '**',
      redirectTo: '',
    },
  ];
}
