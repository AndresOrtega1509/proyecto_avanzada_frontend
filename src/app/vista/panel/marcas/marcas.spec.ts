import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasComponent } from './marcas';

describe('Marcas', () => {
  let component: MarcasComponent;
  let fixture: ComponentFixture<MarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
