import { initFederation } from '@angular-architects/native-federation-v4';

initFederation({ 'mfe-products': './remoteEntry.json' })
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
