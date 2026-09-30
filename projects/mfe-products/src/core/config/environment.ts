import { provideAppEnvironment } from 'lib-config';

import { environment } from '../../environments';

export { APP_ENVIRONMENT, type AppEnvironment } from 'lib-config';

export function provideEnvironment() {
  return provideAppEnvironment(environment);
}
