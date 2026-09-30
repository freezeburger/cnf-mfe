import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { ProductsHttpService } from '@products/infra/http/products-http.service';
import type { Product, ProductDraft } from '@products/features/products/models/product.model';

/**
 * Owns write operations for the product domain.
 *
 * @example
 * inject(ProductCommandsService).create(productDraft);
 */
@Injectable({ providedIn: 'root' })
export class ProductCommandsService {
  private readonly api = inject(ProductsHttpService);

  create(product: ProductDraft): Observable<Product> {
    return this.api.create(product);
  }
}
