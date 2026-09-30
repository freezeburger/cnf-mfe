import { InjectionToken, type Provider } from '@angular/core';

export interface AppEnvironment {
  appName: string;
  apiBaseUrl: string;
  sseUrl: string;
}

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('APP_ENVIRONMENT');

export function provideAppEnvironment(environment: AppEnvironment): Provider[] {
  return [{ provide: APP_ENVIRONMENT, useValue: environment }];
}
