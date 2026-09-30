import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ProductCommandsService } from '@products/features/products/services/product-commands.service';
import { ProductsQueryService } from '@products/features/products/services/products-query.service';
import {
  productCategories,
  productDraftSchema,
  type ProductCategoryFilter,
  type ProductDraft,
} from '@products/features/products/models/product.model';

const emptyProduct: ProductDraft = {
  name: '',
  category: 'tech',
  price: 0,
  stock: 0,
  description: '',
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return fallback;
}

/** Coordinates catalogue queries, filters, and product-creation commands for the page. */
@Injectable()
export class ProductsPresenter {
  private readonly query = inject(ProductsQueryService);
  private readonly commands = inject(ProductCommandsService);

  readonly products = this.query.products;
  readonly categories = productCategories;
  readonly searchTerm = signal('');
  readonly category = signal<ProductCategoryFilter>('all');
  readonly draft = signal<ProductDraft>({ ...emptyProduct });
  readonly saving = signal(false);
  readonly saveMessage = signal('');
  readonly saveError = signal('');
  readonly loadError = computed(() => this.products.error());
  readonly loadErrorMessage = computed(() =>
    getErrorMessage(this.products.error(), 'Erreur inconnue lors du chargement du catalogue.'),
  );

  readonly filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase();
    const category = this.category();

    return (this.products.value() ?? []).filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch =
        !search || `${product.name} ${product.description}`.toLocaleLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  });

  async createProduct(): Promise<void> {
    this.saveMessage.set('');
    this.saveError.set('');

    const result = productDraftSchema.safeParse(this.draft());
    if (!result.success) {
      this.saveError.set(result.error.issues[0]?.message ?? 'Vérifiez les champs du formulaire.');
      return;
    }

    this.saving.set(true);
    try {
      await firstValueFrom(this.commands.create(result.data));
      this.draft.set({ ...emptyProduct });
      this.saveMessage.set('Le produit a été créé.');
      this.query.refresh();
    } catch (error: unknown) {
      this.saveError.set(
        getErrorMessage(error, 'Une erreur inattendue est survenue pendant l’enregistrement.'),
      );
    } finally {
      this.saving.set(false);
    }
  }
}
