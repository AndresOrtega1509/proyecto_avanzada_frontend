import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UnidadMedida } from '../../../core/models/unidad-medida.model';
import { UnidadesMedidaService } from '../../../core/services/unidades-medida.service';

@Component({
  selector: 'app-unidad-medida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unidades-medida.html',
  styleUrl: './unidades-medida.css',
})
export class UnidadMedidaComponent implements OnInit {
  unidades: UnidadMedida[] = [];
  unidadesFiltradas: UnidadMedida[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  unidadSeleccionada: UnidadMedida | null = null;

  form: {
    nombre: string;
  } = this.getFormInicial();

  constructor(private unidadesService: UnidadesMedidaService) {}

  ngOnInit(): void {
    this.cargarUnidades();
  }

  private getFormInicial() {
    return {
      nombre: '',
    };
  }

  cargarUnidades(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.unidadesService.getUnidadesMedida().subscribe({
      next: (data) => {
        this.unidades = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar unidades de medida', err);
        this.mensajeError = 'Error al cargar las unidades de medida.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.unidadesFiltradas = term
      ? this.unidades.filter((u) => u.nombre.toLowerCase().includes(term))
      : [...this.unidades];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevaUnidad(): void {
    this.modoEdicion = false;
    this.unidadSeleccionada = null;
    this.form = this.getFormInicial();
  }

  editar(unidad: UnidadMedida): void {
    this.modoEdicion = true;
    this.unidadSeleccionada = unidad;

    this.form = {
      nombre: unidad.nombre,
    };
  }

  cancelar(): void {
    this.nuevaUnidad();
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      this.mensajeError = 'El nombre es obligatorio.';
      return;
    }

    this.mensajeError = '';

    const payload: UnidadMedida = {
      nombre: this.form.nombre.trim(),
    };

    if (this.modoEdicion && this.unidadSeleccionada?.idUnidadMedida != null) {
      this.unidadesService
        .updateUnidadMedida(this.unidadSeleccionada.idUnidadMedida, payload)
        .subscribe({
          next: () => {
            this.cargarUnidades();
            this.nuevaUnidad();
          },
          error: (err) => {
            console.error('Error al actualizar unidad de medida', err);
            this.mensajeError = 'Error al actualizar la unidad de medida.';
          },
        });
    } else {
      this.unidadesService.createUnidadMedida(payload).subscribe({
        next: () => {
          this.cargarUnidades();
          this.nuevaUnidad();
        },
        error: (err) => {
          console.error('Error al crear unidad de medida', err);
          this.mensajeError = 'Error al crear la unidad de medida.';
        },
      });
    }
  }

  eliminar(unidad: UnidadMedida): void {
    if (!unidad.idUnidadMedida) return;

    const confirmar = confirm(`¿Eliminar la unidad de medida "${unidad.nombre}"?`);
    if (!confirmar) return;

    this.unidadesService.deleteUnidadMedida(unidad.idUnidadMedida).subscribe({
      next: () => this.cargarUnidades(),
      error: (err) => {
        console.error('Error al eliminar unidad de medida', err);
        this.mensajeError = 'Error al eliminar la unidad de medida.';
      },
    });
  }
}
