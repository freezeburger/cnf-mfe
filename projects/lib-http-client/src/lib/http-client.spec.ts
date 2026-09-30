import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpClientService, type HttpClientError } from './http-client';

describe('HttpClientService', () => {
  let client: HttpClientService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    client = TestBed.inject(HttpClientService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('returns a successful response', () => {
    let result: { status: string } | undefined;

    client.get<{ status: string }>('/api/health').subscribe((response) => (result = response));
    httpTesting.expectOne('/api/health').flush({ status: 'ok' });

    expect(result).toEqual({ status: 'ok' });
  });

  it('normalizes HTTP failures', () => {
    let result: HttpClientError | undefined;

    client.get('/api/health').subscribe({
      error: (error: HttpClientError) => (result = error),
    });
    httpTesting
      .expectOne('/api/health')
      .flush('unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(result).toMatchObject({
      status: 503,
      code: 'HttpErrorResponse',
    });
    expect(result?.message).toContain('503');
  });
});
