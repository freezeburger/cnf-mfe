/**
 * Generates a standardized Native Federation remote (`projects/mfe-<domain>`) and registers it
 * in the workspace and the shell.
 *
 * @example
 * npm run generate:mfe -- orders
 * npm run generate:mfe -- customer-orders --entity order --label "Commandes" --port 4210
 * npm run generate:mfe -- orders --dry-run
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const RESERVED = new Set(['shell', 'products', 'admin', 'config', 'design-system', 'http-client']);

function fail(message) {
  console.error(`\u2716 ${message}`);
  console.error('Usage: npm run generate:mfe -- <domain> [--entity <name>] [--label <text>]');
  console.error('                                         [--port <number>] [--dry-run]');
  process.exit(1);
}

function parseArgs(argv) {
  const options = { dryRun: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (['--entity', '--label', '--port'].includes(arg)) {
      const value = argv[++i];
      if (value === undefined) fail(`Missing value for ${arg}.`);
      options[arg.slice(2)] = value;
    } else if (arg.startsWith('--')) {
      fail(`Unknown option ${arg}.`);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length !== 1) fail('Exactly one domain name is required.');
  options.domain = positional[0].toLowerCase().replace(/^mfe-/, '');
  return options;
}

const pascal = (kebab) =>
  kebab
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
const camel = (kebab) => pascal(kebab)[0].toLowerCase() + pascal(kebab).slice(1);
const title = (kebab) =>
  kebab
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');

function singular(kebab) {
  if (kebab.endsWith('ies')) return `${kebab.slice(0, -3)}y`;
  if (kebab.endsWith('s') && !kebab.endsWith('ss')) return kebab.slice(0, -1);
  return `${kebab}-item`;
}

const read = (file) => readFileSync(join(root, file), 'utf8');
const eolOf = (text) => (text.includes('\r\n') ? '\r\n' : '\n');

/** Returns the index of the brace closing the one opened at `openIndex`. */
function matchingBrace(text, openIndex) {
  let depth = 0;
  let inString = false;
  for (let i = openIndex; i < text.length; i++) {
    const char = text[i];
    if (inString) {
      if (char === '\\') i++;
      else if (char === '"') inString = false;
    } else if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth++;
    } else if (char === '}' && --depth === 0) {
      return i;
    }
  }
  throw new Error('Unbalanced braces.');
}

function usedPorts(angularJson) {
  return [...angularJson.matchAll(/"port":\s*(\d+)/g)].map((match) => Number(match[1]));
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const options = parseArgs(process.argv.slice(2));
const domain = options.domain;
if (!KEBAB.test(domain)) fail(`"${domain}" must be kebab-case (e.g. orders, customer-orders).`);
if (RESERVED.has(domain)) fail(`"${domain}" is reserved by the workspace.`);

const entity = (options.entity ?? singular(domain)).toLowerCase();
if (!KEBAB.test(entity)) fail(`Entity "${entity}" must be kebab-case.`);
if (entity === domain) fail('The entity name must differ from the domain name (use --entity).');

const project = `mfe-${domain}`;
const projectDir = `projects/${project}`;
const alias = `@${domain}`;
const angularJson = read('angular.json');
const tsconfigJson = read('tsconfig.json');

if (existsSync(join(root, projectDir))) fail(`${projectDir} already exists.`);
if (angularJson.includes(`"${project}": {`)) fail(`${project} is already declared in angular.json.`);
if (tsconfigJson.includes(`"${alias}/*"`)) fail(`The alias ${alias}/* already exists.`);

const port = options.port
  ? Number(options.port)
  : Math.max(4200, ...usedPorts(angularJson).filter((value) => value < 5000)) + 1;
if (!Number.isInteger(port) || port < 1024 || port > 65535) fail(`Invalid port "${options.port}".`);
if (usedPorts(angularJson).includes(port)) fail(`Port ${port} is already used in angular.json.`);

const n = {
  domain,
  Domain: pascal(domain),
  domainCamel: camel(domain),
  entity,
  Entity: pascal(entity),
  entityCamel: camel(entity),
  label: options.label ?? title(domain),
  project,
  alias,
  port,
};

// ---------------------------------------------------------------------------
// Templates (standard MFE layout: core / share / layout / infra / features)
// ---------------------------------------------------------------------------

const files = {
  'federation.config.mjs': read('projects/mfe-admin/federation.config.mjs').replaceAll(
    'mfe-admin',
    project,
  ),

  'tsconfig.app.json': `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/app",
    "types": []
  },
  "include": [
    "src/**/*.ts",
    "../../dist/design-system",
    "../../dist/http-client",
    "../../dist/lib-config",
    "../../dist/mfe-sse"
  ],
  "exclude": ["src/**/*.spec.ts"]
}
`,

  'tsconfig.spec.json': read('projects/mfe-admin/tsconfig.spec.json'),

  'README.md': `# \`${project}\`

Remote Native Federation responsable du domaine ${n.label}.

## Fonctionnalités

- lecture des ${domain} avec \`resource\` ;
- validation des DTO avec Zod ;
- recherche locale orchestrée par un presenter ;
- affichage du dernier message SSE partagé.

## Architecture

\`\`\`text
src/
  core/config/       # lie les valeurs locales au contrat lib-config
  core/services/     # services applicatifs transverses du remote
  environments.ts    # valeurs d'environnement propres au remote
  share/components/  # barrel des composants réutilisables
  layout/            # chrome propre au MFE
  infra/http/        # adaptation de http-client vers l'API ${n.Domain}
  features/${domain}/
    models/          # schémas Zod et types inférés
    services/        # queries (et commandes) métier
    components/      # composants de présentation
    pages/           # route lazy et présentation SSE
    ${domain}.presenter.ts
\`\`\`

\`federation.config.mjs\` expose \`./Routes\`. Le shell monte ces routes sous \`/${domain}\`.

## Démarrage

\`\`\`bash
npm run api
npm run sse
npm run serve:${domain}
\`\`\`

Le remote écoute sur \`http://localhost:${port}\`. Il peut fonctionner seul ou être chargé par
le shell sur \`http://localhost:4200/${domain}\`.
`,

  'src/index.html': `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>${n.Domain}Mfe</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`,

  'src/main.ts': `import { initFederation } from '@angular-architects/native-federation-v4';

initFederation({ '${project}': './remoteEntry.json' })
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
`,

  'src/bootstrap.ts': read('projects/mfe-admin/src/bootstrap.ts'),

  'src/styles.css': '/* Global styles for the remote when served standalone. */\n',

  'src/environments.ts': `import type { AppEnvironment } from 'lib-config';

export const environment: AppEnvironment = {
  appName: '${n.label} MFE',
  apiBaseUrl: 'http://localhost:3000',
  sseUrl: 'http://localhost:3001/events',
};
`,

  'src/app/app.ts': `/**
 * ${n.label} micro frontend entry point.
 *
 * @example
 * <app-root></app-root>
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppLayout } from '../layout/app-layout.component';

@Component({
  selector: 'app-root',
  imports: [AppLayout],
  template: '<app-layout />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
`,

  'src/app/app.config.ts': `import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideEnvironment } from '${alias}/core/config/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    ...provideEnvironment(),
  ],
};
`,

  'src/app/app.routes.ts': `import { Routes } from '@angular/router';

import { provideEnvironment } from '${alias}/core/config/environment';
import { ${n.Domain}QueryService } from '${alias}/features/${domain}/services/${domain}-query.service';
import { ${n.Domain}HttpService } from '${alias}/infra/http/${domain}-http.service';

/** Routes exposed to the shell through Native Federation (\`./Routes\`). */
export const routes: Routes = [
  {
    path: '',
    providers: [...provideEnvironment(), ${n.Domain}HttpService, ${n.Domain}QueryService],
    loadComponent: () =>
      import('../features/${domain}/pages/${domain}.page').then((module) => module.${n.Domain}Page),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
`,

  'src/core/config/environment.ts': read('projects/mfe-admin/src/core/config/environment.ts'),

  'src/core/services/index.ts': `/** Application services of the remote (notifications, auth adapters, ...). */
export {};
`,

  'src/share/components/index.ts': `export { DesignSystemCard } from 'design-system';
`,

  'src/layout/app-layout.component.ts': `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * Chrome displayed when the remote is served standalone.
 *
 * @example
 * <app-layout />
 */
@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet],
  template: \`
    <main class="app-shell">
      <header class="topbar">
        <a class="brand" routerLink="/" aria-label="Accueil ${n.label}">Atelier · ${n.label}</a>
        <span class="context">Microfrontend ${n.label}</span>
      </header>
      <div class="content">
        <router-outlet />
      </div>
    </main>
  \`,
  styles: \`
    :host {
      display: block;
      min-height: 100vh;
    }
    .app-shell {
      min-height: 100vh;
      background: #f8fafc;
      color: #0f172a;
      font-family: Inter, system-ui, sans-serif;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 1rem clamp(1rem, 4vw, 3rem);
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
    }
    .brand {
      color: #0f172a;
      font-weight: 800;
      text-decoration: none;
    }
    .context {
      color: #475569;
      font-size: 0.9rem;
    }
    .content {
      width: min(1120px, calc(100% - 2rem));
      margin-inline: auto;
      padding-block: 2rem;
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayout {}
`,

  [`src/infra/http/${domain}-http.service.ts`]: `import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { HttpClientService } from 'http-client';

import { APP_ENVIRONMENT } from '${alias}/core/config/environment';
import {
  ${n.entityCamel}ListSchema,
  type ${n.Entity},
} from '${alias}/features/${domain}/models/${entity}.model';

/**
 * Adapts the shared HTTP client to the ${domain} API and validates its payloads.
 *
 * @example
 * inject(${n.Domain}HttpService).list();
 */
@Injectable({ providedIn: 'root' })
export class ${n.Domain}HttpService {
  private readonly client = inject(HttpClientService);
  private readonly environment = inject(APP_ENVIRONMENT);

  list(): Observable<${n.Entity}[]> {
    return this.client
      .get<unknown>(\`\${this.environment.apiBaseUrl}/${domain}\`)
      .pipe(map((response) => ${n.entityCamel}ListSchema.parse(response)));
  }
}
`,

  [`src/features/${domain}/models/${entity}.model.ts`]: `import { z } from 'zod';

export const ${n.entityCamel}Schema = z.object({
  id: z.string(),
  title: z.string().trim().min(2),
  description: z.string().trim(),
  createdAt: z.iso.datetime(),
});

export const ${n.entityCamel}ListSchema = z.array(${n.entityCamel}Schema);

export type ${n.Entity} = z.infer<typeof ${n.entityCamel}Schema>;
`,

  [`src/features/${domain}/services/${domain}-query.service.ts`]: `import { firstValueFrom } from 'rxjs';
import { inject, Injectable, resource } from '@angular/core';

import { ${n.Domain}HttpService } from '${alias}/infra/http/${domain}-http.service';

/**
 * Exposes the ${domain} read model through an Angular resource (query side of CQS).
 *
 * @example
 * inject(${n.Domain}QueryService).${n.domainCamel}.value();
 */
@Injectable({ providedIn: 'root' })
export class ${n.Domain}QueryService {
  private readonly api = inject(${n.Domain}HttpService);

  readonly ${n.domainCamel} = resource({
    loader: () => firstValueFrom(this.api.list()),
  });
}
`,

  [`src/features/${domain}/components/${entity}-card.component.ts`]: `import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DesignSystemCard } from '${alias}/share/components';
import type { ${n.Entity} } from '${alias}/features/${domain}/models/${entity}.model';

/**
 * Presents one ${entity}.
 *
 * @example
 * <app-${entity}-card [${n.entityCamel}]="${n.entityCamel}" />
 */
@Component({
  selector: 'app-${entity}-card',
  imports: [DatePipe, DesignSystemCard],
  template: \`
    <lib-design-system-card
      [title]="${n.entityCamel}().title"
      [description]="${n.entityCamel}().description"
      eyebrow="${n.label}"
    >
      <time [attr.datetime]="${n.entityCamel}().createdAt">
        {{ ${n.entityCamel}().createdAt | date: 'short' }}
      </time>
    </lib-design-system-card>
  \`,
  styles: \`
    time {
      color: #475569;
      font-size: 0.78rem;
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${n.Entity}CardComponent {
  readonly ${n.entityCamel} = input.required<${n.Entity}>();
}
`,

  [`src/features/${domain}/components/index.ts`]: `export * from './${entity}-card.component';
`,

  [`src/features/${domain}/${domain}.presenter.ts`]: `import { computed, inject, Injectable, signal } from '@angular/core';

import { ${n.Domain}QueryService } from '${alias}/features/${domain}/services/${domain}-query.service';

/**
 * Coordinates the ${domain} query and the local search of the page.
 *
 * @example
 * providers: [${n.Domain}Presenter]
 */
@Injectable()
export class ${n.Domain}Presenter {
  private readonly query = inject(${n.Domain}QueryService);

  readonly ${n.domainCamel} = this.query.${n.domainCamel};
  readonly search = signal('');
  readonly all = computed(() => (this.${n.domainCamel}.hasValue() ? this.${n.domainCamel}.value() : []));
  readonly visible = computed(() => {
    const term = this.search().trim().toLowerCase();
    return term
      ? this.all().filter((item) => item.title.toLowerCase().includes(term))
      : this.all();
  });
  readonly loadErrorMessage = computed(() => {
    const error = this.${n.domainCamel}.error();
    return error instanceof Error ? error.message : 'Erreur inconnue lors du chargement.';
  });
}
`,

  [`src/features/${domain}/pages/${domain}.page.ts`]: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { getMfeEventMessage, MfeSseBridge } from 'mfe-sse';

import { APP_ENVIRONMENT } from '${alias}/core/config/environment';
import { ${n.Entity}CardComponent } from '${alias}/features/${domain}/components';
import { ${n.Domain}Presenter } from '${alias}/features/${domain}/${domain}.presenter';

/**
 * ${n.label} page: lazy-loaded resource query, local search and shared SSE message.
 *
 * @example
 * <app-${domain}-page />
 */
@Component({
  selector: 'app-${domain}-page',
  imports: [${n.Entity}CardComponent],
  providers: [${n.Domain}Presenter],
  template: \`
    <section class="page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">${n.label}</p>
          <h1>${n.label}</h1>
        </div>
        <button type="button" (click)="presenter.${n.domainCamel}.reload()">Actualiser</button>
      </header>

      <section class="live-message" aria-labelledby="${domain}-live-title" aria-live="polite">
        <h2 id="${domain}-live-title">Message temps réel</h2>
        <p>{{ eventMessage() }}</p>
      </section>

      <label>
        <span>Rechercher</span>
        <input
          type="search"
          [value]="presenter.search()"
          (input)="presenter.search.set(readValue($event))"
        />
      </label>

      @if (presenter.${n.domainCamel}.isLoading()) {
        <p class="feedback" role="status">Chargement…</p>
      } @else if (presenter.${n.domainCamel}.error()) {
        <p class="feedback error" role="alert">{{ presenter.loadErrorMessage() }}</p>
      } @else if (presenter.visible().length === 0) {
        <p class="feedback">Aucun élément à afficher.</p>
      } @else {
        <div class="grid">
          @for (item of presenter.visible(); track item.id) {
            <app-${entity}-card [${n.entityCamel}]="item" />
          }
        </div>
      }
    </section>
  \`,
  styles: \`
    .page {
      display: grid;
      gap: 1.5rem;
    }
    .page-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
    }
    .eyebrow {
      margin: 0 0 0.35rem;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1,
    h2 {
      margin: 0;
    }
    .live-message {
      display: grid;
      gap: 0.25rem;
      padding: 1rem 1.2rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.8rem;
      background: #fff;
    }
    .live-message h2 {
      font-size: 1rem;
    }
    .live-message p {
      margin: 0;
    }
    label {
      display: grid;
      gap: 0.35rem;
      max-width: 24rem;
      font-weight: 650;
    }
    input {
      min-height: 2.6rem;
      padding: 0.55rem 0.7rem;
      border: 1px solid #94a3b8;
      border-radius: 0.5rem;
      font: inherit;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .feedback {
      margin: 0;
      padding: 1rem;
      border-radius: 0.6rem;
      background: #f1f5f9;
    }
    .error {
      background: #fef2f2;
      color: #991b1b;
    }
    button {
      min-height: 2.6rem;
      padding: 0.55rem 0.85rem;
      border: 0;
      border-radius: 0.5rem;
      background: #334155;
      color: #fff;
      font: inherit;
      font-weight: 750;
      cursor: pointer;
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${n.Domain}Page {
  private readonly environment = inject(APP_ENVIRONMENT);
  readonly sse = inject(MfeSseBridge);
  readonly presenter = inject(${n.Domain}Presenter);

  constructor() {
    this.sse.connect(this.environment.sseUrl);
  }

  protected eventMessage(): string {
    return getMfeEventMessage(this.sse.latestEvent());
  }

  protected readValue(event: Event): string {
    return event.target instanceof HTMLInputElement ? event.target.value : '';
  }
}
`,

  [`src/features/${domain}/index.ts`]: `export * from './components';
export * from './models/${entity}.model';
export * from './${domain}.presenter';
export * from './services/${domain}-query.service';
`,
};

// ---------------------------------------------------------------------------
// Workspace and shell registration (text insertions preserving formatting)
// ---------------------------------------------------------------------------

function insertBefore(text, anchor, insertion, file) {
  const match = text.match(anchor);
  if (!match) throw new Error(`Cannot find insertion point in ${file}.`);
  return text.slice(0, match.index) + insertion + text.slice(match.index);
}

function insertAfter(text, anchor, insertion, file) {
  const match = text.match(anchor);
  if (!match) throw new Error(`Cannot find insertion point in ${file}.`);
  const end = match.index + match[0].length;
  return text.slice(0, end) + insertion + text.slice(end);
}

const updates = {
  'angular.json': (text, eol) => {
    const start = text.indexOf('"mfe-admin": {');
    if (start < 0) throw new Error('mfe-admin template project not found in angular.json.');
    const end = matchingBrace(text, text.indexOf('{', start));
    const block = text
      .slice(start, end + 1)
      .replaceAll('mfe-admin', project)
      .replace(/("serve-original"[\s\S]*?"port":\s*)\d+/, `$1${port}`);
    return `${text.slice(0, end + 1)},${eol}    ${block}${text.slice(end + 1)}`;
  },

  'tsconfig.json': (text, eol) => {
    let result = insertAfter(
      text,
      /"paths":\s*\{\r?\n/,
      `      "${alias}/*": ["${projectDir}/src/*"],${eol}`,
      'tsconfig.json',
    );
    result = insertAfter(
      result,
      /"path":\s*"\.\/projects\/mfe-admin\/tsconfig\.app\.json"\r?\n\s*\}/,
      `,${eol}    {${eol}      "path": "./${projectDir}/tsconfig.app.json"${eol}    }`,
      'tsconfig.json',
    );
    return result;
  },

  'package.json': (text, eol) =>
    insertAfter(
      text,
      /"serve:admin":[^\r\n]*\r?\n/,
      `    "serve:${domain}": "ng serve ${project} --port ${port}",${eol}`,
      'package.json',
    ),

  'server/db.json': (text, eol) => {
    if (new RegExp(`"${domain}"\\s*:`).test(text)) return text;
    const seed = {
      id: `${entity}-1`,
      title: `Premier élément ${n.label}`,
      description: `Donnée d'exemple générée pour ${project}.`,
      createdAt: new Date().toISOString(),
    };
    const body = JSON.stringify([seed], null, 2).replaceAll('\n', `${eol}  `);
    return text.replace(/\r?\n\}\s*$/, `,${eol}  "${domain}": ${body}${eol}}${eol}`);
  },

  'projects/mfe-shell/public/federation.manifest.json': (text, eol) =>
    text.replace(
      /("[^"]+":\s*"[^"]+")(\s*\r?\n\})/,
      `$1,${eol}  "${project}": "http://localhost:${port}/remoteEntry.json"$2`,
    ),

  'projects/mfe-shell/src/app/app.routes.ts': (text, eol) =>
    insertBefore(
      text,
      /[ ]*\{\r?\n\s*path: '\*\*',/,
      [
        '    {',
        `      path: '${domain}',`,
        '      loadChildren: () =>',
        '        federation',
        '          .as<RemoteRoutes>()',
        `          .loadRemoteModule('${project}', './Routes')`,
        '          .then((module) => module.routes),',
        '    },',
        '',
      ].join(eol),
      'app.routes.ts',
    ),

  'projects/mfe-shell/src/app/app.html': (text, eol) =>
    insertBefore(
      text,
      /[ ]*<\/nav>/,
      `      <a routerLink="/${domain}">${n.label}</a>${eol}`,
      'app.html',
    ),
};

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

const eol = eolOf(angularJson);
const patched = Object.fromEntries(
  Object.entries(updates).map(([file, update]) => {
    const original = read(file);
    const next = update(original, eolOf(original));
    if (next === original && file !== 'server/db.json') {
      throw new Error(`No change applied to ${file}.`);
    }
    return [file, next];
  }),
);

const created = Object.keys(files).map((file) => `${projectDir}/${file}`);
console.log(`${options.dryRun ? '[dry-run] ' : ''}Generating ${project} on port ${port}`);

if (!options.dryRun) {
  for (const [file, content] of Object.entries(files)) {
    const target = join(root, projectDir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content.replace(/\r?\n/g, eol));
  }
  mkdirSync(join(root, projectDir, 'public'), { recursive: true });
  copyFileSync(
    join(root, 'projects/mfe-admin/public/favicon.ico'),
    join(root, projectDir, 'public/favicon.ico'),
  );
  for (const [file, content] of Object.entries(patched)) {
    writeFileSync(join(root, file), content);
  }
}

console.log('\nCreated:');
for (const file of [...created, `${projectDir}/public/favicon.ico`]) console.log(`  + ${file}`);
console.log('\nUpdated:');
for (const file of Object.keys(patched)) console.log(`  ~ ${relative(root, join(root, file))}`);
console.log(`
Next steps:
  npx ng build ${project}
  npm run api
  npm run sse
  npm run serve:${domain}
  npm run serve:shell   # then open http://localhost:4200/${domain}`);
