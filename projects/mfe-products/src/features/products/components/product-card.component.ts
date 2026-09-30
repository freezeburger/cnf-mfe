import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DesignSystemCard } from 'design-system';

import type { Product } from '@products/features/products/models/product.model';

/**
 * Displays product data consistently with the shared design system.
 *
 * @example
 * <app-product-card [product]="product" />
 */
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, DesignSystemCard],
  template: `
    <lib-design-system-card
      [title]="product().name"
      [description]="product().description"
      [eyebrow]="product().category"
    >
      <div class="meta">
        <strong>{{ product().price | currency: 'EUR' }}</strong>
        <span>{{ product().stock }} en stock</span>
      </div>
    </lib-design-system-card>
  `,
  styles: `
    .meta {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      color: #334155;
      font-size: 0.9rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
}
