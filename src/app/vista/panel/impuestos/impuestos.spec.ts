import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Impuestos } from './impuestos';

describe('Impuestos', () => {
  let component: Impuestos;
  let fixture: ComponentFixture<Impuestos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Impuestos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Impuestos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
