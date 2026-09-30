import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSystemCard } from './design-system';

describe('DesignSystemCard', () => {
  let fixture: ComponentFixture<DesignSystemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSystemCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSystemCard);
    fixture.componentRef.setInput('title', 'Catalogue');
    fixture.componentRef.setInput('description', 'Vue des produits disponibles');
    fixture.detectChanges();
  });

  it('renders its title and description inputs', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Catalogue');
    expect(fixture.nativeElement.textContent).toContain('Vue des produits disponibles');
  });
});
