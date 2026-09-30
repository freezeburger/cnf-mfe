import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { HttpClientService } from 'http-client';

import { APP_ENVIRONMENT } from '@admin/core/config/environment';
import { alertListSchema, type Alert } from '@admin/features/alerts/models/alert.model';

/**
 * Adapts the shared HTTP client to the alerts API and validates its payloads.
 *
 * @example
 * inject(AlertsHttpService).list();
 */
@Injectable({ providedIn: 'root' })
export class AlertsHttpService {
  private readonly client = inject(HttpClientService);
  private readonly environment = inject(APP_ENVIRONMENT);

  list(): Observable<Alert[]> {
    return this.client
      .get<unknown>(`${this.environment.apiBaseUrl}/alerts`)
      .pipe(map((response) => alertListSchema.parse(response)));
  }
}
