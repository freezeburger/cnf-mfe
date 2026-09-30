import {
  initFederation,
  type NativeFederationResult,
} from '@angular-architects/native-federation-v4';

initFederation('federation.manifest.json')
  .then((federation: NativeFederationResult) =>
    import('./bootstrap').then(({ bootstrap }) => bootstrap(federation)),
  )
  .catch((error: unknown) => console.error('Native Federation initialization failed.', error));
