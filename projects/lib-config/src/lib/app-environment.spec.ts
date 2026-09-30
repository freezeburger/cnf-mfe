import { TestBed } from '@angular/core/testing';

import { APP_ENVIRONMENT, type AppEnvironment, provideAppEnvironment } from './app-environment';

describe('provideAppEnvironment', () => {
  it('provides the application-specific environment through the shared token', () => {
    const environment: AppEnvironment = {
      appName: 'Test MFE',
      apiBaseUrl: 'http://localhost:3000',
      sseUrl: 'http://localhost:3001/events',
    };

    TestBed.configureTestingModule({
      providers: provideAppEnvironment(environment),
    });

    expect(TestBed.inject(APP_ENVIRONMENT)).toBe(environment);
  });
});
