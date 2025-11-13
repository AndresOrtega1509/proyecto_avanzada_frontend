import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadMedidaComponent } from './unidades-medida';

describe('UnidadesMedida', () => {
  let component: UnidadMedidaComponent;
  let fixture: ComponentFixture<UnidadMedidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadMedidaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
