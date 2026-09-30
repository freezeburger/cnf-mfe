/**
 * Shell application entry point.
 *
 * @example
 * <app-root></app-root>
 */
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { APP_ENVIRONMENT } from '@core/config/environment';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly environment = inject(APP_ENVIRONMENT);

  protected readonly title = signal('MFE Shell');
  protected readonly productsMfeUrl = this.environment.productsMfeUrl;
  protected readonly adminMfeUrl = this.environment.adminMfeUrl;
}
