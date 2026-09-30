import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DesignSystemCard } from '@orders/share/components';
import type { Order } from '@orders/features/orders/models/order.model';

/**
 * Presents one order.
 *
 * @example
 * <app-order-card [order]="order" />
 */
@Component({
  selector: 'app-order-card',
  imports: [DatePipe, DesignSystemCard],
  template: `
    <lib-design-system-card
      [title]="order().title"
      [description]="order().description"
      eyebrow="Orders"
    >
      <time [attr.datetime]="order().createdAt">
        {{ order().createdAt | date: 'short' }}
      </time>
    </lib-design-system-card>
  `,
  styles: `
    time {
      color: #475569;
      font-size: 0.78rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCardComponent {
  readonly order = input.required<Order>();
}
