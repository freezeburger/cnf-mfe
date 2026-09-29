import { Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { HttpClientService } from 'http-client';

import { environment } from '../../environments';
import { productListSchema, type Product } from '../../core/types';

@Injectable({ providedIn: 'root' })
export class AppHttpService {
  constructor(private readonly http: HttpClientService) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<unknown>(`${environment.apiBaseUrl}/products`)
      .pipe(map((payload) => productListSchema.parse(payload)));
  }

  getHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${environment.apiBaseUrl}/health`);
  }
}
