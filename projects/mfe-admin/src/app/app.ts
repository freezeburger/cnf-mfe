/**
 * Administration micro frontend entry point.
 *
 * @example
 * <app-root></app-root>
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppLayout } from '../layout/app-layout.component';

@Component({
  selector: 'app-root',
  imports: [AppLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
