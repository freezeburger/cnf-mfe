import { Routes } from '@angular/router';

import { provideEnvironment } from '@admin/core/config/environment';
import { AlertsQueryService } from '@admin/features/alerts/services/alerts-query.service';
import { AlertsHttpService } from '@admin/infra/http/alerts-http.service';

export const routes: Routes = [
  {
    path: '',
    providers: [...provideEnvironment(), AlertsHttpService, AlertsQueryService],
    loadComponent: () =>
      import('../features/alerts/pages/alerts.page').then((module) => module.AlertsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
