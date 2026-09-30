/**
 * Shell application entry point.
 *
 * @example
 * <app-root></app-root>
 */
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { MfeSseBridge } from 'mfe-sse';

import { APP_ENVIRONMENT } from '../core/config/environment';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly environment = inject(APP_ENVIRONMENT);
  protected readonly sse = inject(MfeSseBridge);
  protected readonly title = signal('MFE Shell');

  constructor() {
    this.sse.connect(this.environment.sseUrl);
  }
}
