# `lib-config`

Shared configuration contracts for the shell and microfrontends.

## Responsibility

The library owns only:

- the `AppEnvironment` interface;
- the shared `APP_ENVIRONMENT` injection token;
- `provideAppEnvironment`, which binds an application's concrete values to that token.

Concrete environment values remain application-owned in each `src/environments.ts`. This keeps
the library reusable and lets a remote run standalone or inside the shell.

## Usage

```ts
import { provideAppEnvironment } from 'lib-config';
import { environment } from './environments';

export const providers = provideAppEnvironment(environment);
```

Native Federation shares `lib-config` as a singleton so providers and consumers use the exact
same injection-token instance.

## Commands

```bash
npx ng build lib-config
npx ng test lib-config --watch=false
```
