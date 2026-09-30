import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet],
  template: `
    <main class="app-shell">
      <header class="topbar">
        <a class="brand" routerLink="/" aria-label="Accueil du catalogue">Atelier · Catalogue</a>
        <span class="context">Microfrontend Produits</span>
      </header>
      <div class="content">
        <router-outlet />
      </div>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
    .app-shell {
      min-height: 100vh;
      background: #f1f5f9;
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
      font-size: 1.05rem;
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayout {}
