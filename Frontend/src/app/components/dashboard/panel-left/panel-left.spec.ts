import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLeft } from './panel-left';

describe('PanelLeft', () => {
  let component: PanelLeft;
  let fixture: ComponentFixture<PanelLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelLeft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelLeft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
