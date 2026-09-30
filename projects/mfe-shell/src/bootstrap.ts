import { bootstrapApplication } from '@angular/platform-browser';
import type { NativeFederationResult } from '@angular-architects/native-federation-v4';

import { App } from './app/app';
import { appConfig } from './app/app.config';

export function bootstrap(federation: NativeFederationResult): Promise<unknown> {
  return bootstrapApplication(App, appConfig(federation)).catch((error: unknown) => {
    console.error('Angular shell bootstrap failed.', error);
    throw error;
  });
}
