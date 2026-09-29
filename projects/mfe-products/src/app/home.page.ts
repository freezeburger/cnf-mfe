/**
 * Product overview page for the catalog MFE.
 *
 * @example
 * <app-home-page />
 */
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { DesignSystemCard } from 'design-system';

import type { Product, ProductCategory } from '@core/types';

const productsSeed: Product[] = [
  {
    id: 'p-1001',
    name: 'Capteur IA',
    category: 'tech',
    price: 149.9,
    stock: 12,
    description: 'Boîtier d’acquisition intelligent pour supervision de production.',
  },
  {
    id: 'p-1002',
    name: 'Diffuseur Zen',
    category: 'wellness',
    price: 79,
    stock: 25,
    description: 'Système à faible bruit pour les espaces de concentration.',
  },
  {
    id: 'p-1003',
    name: 'Lampe Studio',
    category: 'home',
    price: 99.5,
    stock: 18,
    description: 'Éclairage réglable pour environnements de travail et résidentiels.',
  },
];

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CurrencyPipe, DesignSystemCard],
  template: `
    <section class="home-shell">
      <p class="eyebrow">Produits</p>
      <h2>{{ title() }}</h2>

      <div class="filters" role="tablist" aria-label="Filtrer les produits">
        @for (category of categories; track category) {
          <button type="button" [class.active]="selectedCategory() === category" (click)="selectedCategory.set(category)">
            {{ category === 'all' ? 'Tous' : category }}
          </button>
        }
      </div>

      <div class="product-grid">
        @for (product of filteredProducts(); track product.id) {
          <lib-design-system-card
            [title]="product.name"
            [description]="product.description"
            eyebrow="{{ product.category }}"
          >
            <div class="meta">
              <span>{{ product.price | currency:'EUR' }}</span>
              <span>{{ product.stock }} en stock</span>
            </div>
          </lib-design-system-card>
        }
      </div>
    </section>
  `,
  styles: `
    .home-shell {
      margin-top: 1.5rem;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255,255,255,0.82);
      border: 1px solid rgba(16,185,129,0.18);
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: #0f766e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    button {
      border: 1px solid #cbd5e1;
      border-radius: 999px;
      background: #f8fafc;
      color: #0f172a;
      padding: 0.5rem 0.85rem;
      cursor: pointer;
      font-weight: 600;
    }

    .active {
      background: #0f766e;
      border-color: #0f766e;
      color: white;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #0f172a;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly title = signal('Gestion des produits');
  readonly categories = ['all', 'tech', 'wellness', 'home'] as const;
  readonly selectedCategory = signal<ProductCategory | 'all'>('all');

  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();

    return productsSeed.filter((product) => category === 'all' || product.category === category);
  });
}
