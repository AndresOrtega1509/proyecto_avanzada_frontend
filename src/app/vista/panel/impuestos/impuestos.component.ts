import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImpuestosService } from '../../../core/services/impuestos.service';
import { Impuesto } from '../../../core/models/impuesto.model';

@Component({
  selector: 'app-impuestos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './impuestos.html',
  styleUrl: './impuestos.css',
})
export class ImpuestosComponent implements OnInit {
  impuestos: Impuesto[] = [];
  impuestosFiltrados: Impuesto[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  impuestoSeleccionado: Impuesto | null = null;

  nombre = '';
  porcentaje: number | null = null;

  constructor(private impuestosService: ImpuestosService) {}

  ngOnInit(): void {
    this.cargarImpuestos();
  }

  cargarImpuestos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.impuestosService.getImpuestos().subscribe({
      next: (data) => {
        this.impuestos = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar impuestos', err);
        this.mensajeError = 'Error al cargar los impuestos.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.impuestosFiltrados = term
      ? this.impuestos.filter((i) => i.nombre.toLowerCase().includes(term))
      : [...this.impuestos];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevoImpuesto(): void {
    this.modoEdicion = false;
    this.impuestoSeleccionado = null;
    this.nombre = '';
    this.porcentaje = null;
  }

  editar(impuesto: Impuesto): void {
    this.modoEdicion = true;
    this.impuestoSeleccionado = impuesto;
    this.nombre = impuesto.nombre;
    this.porcentaje = impuesto.porcentaje;
  }

  cancelarEdicion(): void {
    this.nuevoImpuesto();
  }

  guardarImpuesto(): void {
    const nombre = this.nombre.trim();
    const porcentaje = this.porcentaje;

    if (!nombre || porcentaje == null) {
      this.mensajeError = 'Nombre y porcentaje son obligatorios.';
      return;
    }

    if (porcentaje < 0) {
      this.mensajeError = 'El porcentaje no puede ser negativo.';
      return;
    }

    this.mensajeError = '';

    const payload = { nombre, porcentaje };

    if (this.modoEdicion && this.impuestoSeleccionado?.idImpuesto != null) {
      this.impuestosService
        .updateImpuesto(this.impuestoSeleccionado.idImpuesto, payload)
        .subscribe({
          next: () => {
            this.cargarImpuestos();
            this.nuevoImpuesto();
          },
          error: (err) => {
            console.error('Error al actualizar impuesto', err);
            this.mensajeError = 'Error al actualizar el impuesto.';
          },
        });
    } else {
      this.impuestosService.createImpuesto(payload).subscribe({
        next: () => {
          this.cargarImpuestos();
          this.nuevoImpuesto();
        },
        error: (err) => {
          console.error('Error al crear impuesto', err);
          this.mensajeError = 'Error al crear el impuesto.';
        },
      });
    }
  }

  eliminar(impuesto: Impuesto): void {
    if (!impuesto.idImpuesto) return;

    const confirmar = confirm(`¿Eliminar el impuesto "${impuesto.nombre}"?`);
    if (!confirmar) return;

    this.impuestosService.deleteImpuesto(impuesto.idImpuesto).subscribe({
      next: () => this.cargarImpuestos(),
      error: (err) => {
        console.error('Error al eliminar impuesto', err);
        this.mensajeError = 'Error al eliminar el impuesto.';
      },
    });
  }
}
