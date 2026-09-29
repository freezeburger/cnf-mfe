import { Injectable, signal } from '@angular/core';

import type { Alert } from '../types';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly alerts = signal<Alert[]>([]);

  readonly alertsSignal = this.alerts;

  publishAlert(alert: Alert): void {
    this.alerts.update((current) => [alert, ...current].slice(0, 10));
  }

  clear(): void {
    this.alerts.set([]);
  }
}
