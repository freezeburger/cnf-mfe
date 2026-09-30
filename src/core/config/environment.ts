import { InjectionToken, type Provider } from '@angular/core';

import { environment } from '../../environments';

export interface AppEnvironment {
  appName: string;
  apiBaseUrl: string;
  sseUrl: string;
}

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('APP_ENVIRONMENT');

export function provideEnvironment(): Provider[] {
  return [{ provide: APP_ENVIRONMENT, useValue: environment }];
}
