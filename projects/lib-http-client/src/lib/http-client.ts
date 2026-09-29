/**
 * Normalized HTTP client abstraction used by application domains.
 *
 * @example
 * const client = inject(HttpClientService);
 * client.get<Product[]>('/api/products');
 */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface HttpClientError {
  status: number | null;
  code: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  constructor(private readonly http: HttpClient) {}

  get<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.get<T>(url, options).pipe(catchError((error: HttpErrorResponse) => throwError(() => this.normalize(error))));
  }

  post<T>(url: string, body: unknown, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(url, body, options).pipe(catchError((error: HttpErrorResponse) => throwError(() => this.normalize(error))));
  }

  private normalize(error: HttpErrorResponse): HttpClientError {
    return {
      status: error.status ?? null,
      code: error.name ?? 'HTTP_ERROR',
      message: error.message || 'Une erreur réseau est survenue.',
    };
  }
}
