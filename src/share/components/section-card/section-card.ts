import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="section-card">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h3>{{ title() }}</h3>
      <p class="description">{{ description() }}</p>
      <ng-content />
    </article>
  `,
  styles: `
    .section-card {
      display: grid;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.3);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.05);
    }

    .eyebrow {
      margin: 0;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #4f46e5;
    }

    h3 {
      margin: 0;
      font-size: 1.3rem;
    }

    .description {
      margin: 0;
      color: #475569;
      line-height: 1.6;
    }
  `,
})
export class SectionCard {
  readonly eyebrow = input<string>('Overview');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
