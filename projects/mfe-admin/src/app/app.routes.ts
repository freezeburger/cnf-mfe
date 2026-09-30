import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/alerts/pages/alerts.page').then((module) => module.AlertsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
