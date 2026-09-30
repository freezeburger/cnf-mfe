import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import type { NativeFederationResult } from '@angular-architects/native-federation-v4';

import { provideEnvironment } from '@core/config/environment';

import { routes } from './app.routes';

export const NATIVE_FEDERATION = new InjectionToken<NativeFederationResult>('NATIVE_FEDERATION');

export function appConfig(federation: NativeFederationResult): ApplicationConfig {
  return {
    providers: [
      { provide: NATIVE_FEDERATION, useValue: federation },
      provideBrowserGlobalErrorListeners(),
      provideHttpClient(),
      provideRouter(routes(federation)),
      ...provideEnvironment(),
    ],
  };
}
