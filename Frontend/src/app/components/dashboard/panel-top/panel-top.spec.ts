import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTop } from './panel-top';

describe('PanelTop', () => {
  let component: PanelTop;
  let fixture: ComponentFixture<PanelTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelTop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelTop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
