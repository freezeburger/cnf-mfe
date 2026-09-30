import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { HttpClientService } from 'http-client';

import { APP_ENVIRONMENT } from '@products/core/config/environment';
import {
  productListSchema,
  productSchema,
  type Product,
  type ProductDraft,
} from '@products/features/products/models/product.model';

/**
 * Adapts the shared HTTP client to the products API and validates its payloads.
 *
 * @example
 * inject(ProductsHttpService).list();
 */
@Injectable({ providedIn: 'root' })
export class ProductsHttpService {
  private readonly client = inject(HttpClientService);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly endpoint = `${this.environment.apiBaseUrl}/products`;

  list(): Observable<Product[]> {
    return this.client
      .get<unknown>(this.endpoint)
      .pipe(map((response) => productListSchema.parse(response)));
  }

  create(product: ProductDraft): Observable<Product> {
    return this.client
      .post<unknown>(this.endpoint, product)
      .pipe(map((response) => productSchema.parse(response)));
  }
}
