import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfeSse } from './mfe-sse';

describe('MfeSse', () => {
  let component: MfeSse;
  let fixture: ComponentFixture<MfeSse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfeSse],
    }).compileComponents();

    fixture = TestBed.createComponent(MfeSse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
