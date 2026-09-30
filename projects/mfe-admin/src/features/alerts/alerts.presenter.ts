import { computed, inject, Injectable, signal } from '@angular/core';

import { AlertsQueryService } from '@admin/features/alerts/services/alerts-query.service';
import type { AlertSeverity } from '@admin/features/alerts/models/alert.model';

@Injectable()
/** Coordinates alert queries, filters, and summary metrics for the admin page. */
export class AlertsPresenter {
  private readonly query = inject(AlertsQueryService);

  readonly alerts = this.query.alerts;
  readonly loadErrorMessage = computed(() => {
    const error = this.alerts.error();
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return 'Erreur inconnue lors du chargement des alertes.';
  });
  readonly selectedSeverity = signal<AlertSeverity | 'all'>('all');
  readonly severities = ['all', 'critical', 'warning', 'info'] as const;
  readonly visibleAlerts = computed(() => {
    const severity = this.selectedSeverity();
    const alerts = this.alerts.hasValue() ? this.alerts.value() : [];
    return severity === 'all' ? alerts : alerts.filter((alert) => alert.severity === severity);
  });
  readonly allAlerts = computed(() => (this.alerts.hasValue() ? this.alerts.value() : []));
  readonly criticalCount = computed(
    () => this.allAlerts().filter((alert) => alert.severity === 'critical').length,
  );
  readonly warningCount = computed(
    () => this.allAlerts().filter((alert) => alert.severity === 'warning').length,
  );
  readonly totalCount = computed(() => this.allAlerts().length);
}
