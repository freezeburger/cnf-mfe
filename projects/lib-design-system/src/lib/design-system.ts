/**
 * Shared design-system primitive for content cards.
 *
 * @example
 * <lib-design-system-card title="Catalogue" description="Vue d'ensemble" />
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-design-system-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" aria-label="{{ title() }}">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      <ng-content />
    </article>
  `,
  styles: `
    .card {
      display: grid;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: 1rem;
      background: #fff;
      border: 1px solid #dfe7f5;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.04);
    }
    .eyebrow { color: #4f46e5; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
    h3 { margin: 0; }
    p { margin: 0; color: #475569; }
  `,
})
export class DesignSystemCard {
  readonly eyebrow = input<string>('Overview');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
