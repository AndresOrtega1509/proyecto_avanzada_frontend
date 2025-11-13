import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorTelefonosComponent } from './proveedor-telefonos';

describe('ProveedorTelefonos', () => {
  let component: ProveedorTelefonosComponent;
  let fixture: ComponentFixture<ProveedorTelefonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorTelefonosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorTelefonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
