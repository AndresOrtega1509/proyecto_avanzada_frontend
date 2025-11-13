import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Telefonos } from './telefonos';

describe('Telefonos', () => {
  let component: Telefonos;
  let fixture: ComponentFixture<Telefonos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Telefonos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Telefonos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
