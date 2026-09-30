import { firstValueFrom } from 'rxjs';
import { inject, Injectable, resource } from '@angular/core';

import { AlertsHttpService } from '@admin/infra/http/alerts-http.service';

/**
 * Exposes the alert read model through an Angular resource.
 *
 * @example
 * inject(AlertsQueryService).alerts.value();
 */
@Injectable({ providedIn: 'root' })
export class AlertsQueryService {
  private readonly api = inject(AlertsHttpService);

  readonly alerts = resource({
    loader: () => firstValueFrom(this.api.list()),
  });
}
