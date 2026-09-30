import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DesignSystemCard } from 'design-system';

import type { Alert } from '@admin/features/alerts/models/alert.model';

/**
 * Presents one typed alert with severity and timestamp details.
 *
 * @example
 * <app-alert-card [alert]="alert" />
 */
@Component({
  selector: 'app-alert-card',
  imports: [DatePipe, DesignSystemCard],
  template: `
    <lib-design-system-card
      [title]="alert().title"
      [description]="alert().message"
      [eyebrow]="alert().source"
    >
      <div class="meta">
        <span
          class="badge"
          [class.critical]="alert().severity === 'critical'"
          [class.warning]="alert().severity === 'warning'"
        >
          {{ alert().severity }}
        </span>
        <time [attr.datetime]="alert().createdAt">{{ alert().createdAt | date: 'short' }}</time>
      </div>
    </lib-design-system-card>
  `,
  styles: `
    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      color: #475569;
      font-size: 0.78rem;
    }
    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: #e0f2fe;
      color: #075985;
      font-weight: 800;
      text-transform: uppercase;
    }
    .warning {
      background: #fef3c7;
      color: #92400e;
    }
    .critical {
      background: #fee2e2;
      color: #991b1b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertCardComponent {
  readonly alert = input.required<Alert>();
}
