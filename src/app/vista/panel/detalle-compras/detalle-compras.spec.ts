import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCompras } from './detalle-compras';

describe('DetalleCompras', () => {
  let component: DetalleCompras;
  let fixture: ComponentFixture<DetalleCompras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCompras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCompras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
