import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarIntereses } from './agregar-intereses';

describe('AgregarIntereses', () => {
  let component: AgregarIntereses;
  let fixture: ComponentFixture<AgregarIntereses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarIntereses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarIntereses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
