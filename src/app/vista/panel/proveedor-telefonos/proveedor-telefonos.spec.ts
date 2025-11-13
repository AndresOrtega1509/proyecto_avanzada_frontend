import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorTelefonos } from './proveedor-telefonos';

describe('ProveedorTelefonos', () => {
  let component: ProveedorTelefonos;
  let fixture: ComponentFixture<ProveedorTelefonos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorTelefonos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedorTelefonos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
