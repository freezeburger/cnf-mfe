import { firstValueFrom } from 'rxjs';
import { inject, Injectable, resource } from '@angular/core';

import { ProductsHttpService } from '@products/infra/http/products-http.service';

/**
 * Exposes the product read model through an Angular resource.
 *
 * @example
 * inject(ProductsQueryService).products.value();
 */
@Injectable({ providedIn: 'root' })
export class ProductsQueryService {
  private readonly api = inject(ProductsHttpService);

  readonly products = resource({
    loader: () => firstValueFrom(this.api.list()),
  });

  refresh(): void {
    this.products.reload();
  }
}
