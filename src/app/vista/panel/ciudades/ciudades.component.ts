import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CiudadesService } from '../../../core/services/ciudades.service';
import { Ciudad } from '../../../core/models/ciudad.model';

@Component({
  selector: 'app-ciudades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ciudades.html',
  styleUrl: './ciudades.css',
})
export class CiudadesComponent implements OnInit {
  ciudades: Ciudad[] = [];
  ciudadesFiltradas: Ciudad[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  ciudadSeleccionada: Ciudad | null = null;
  nombreCiudad = '';

  constructor(private ciudadesService: CiudadesService) {}

  ngOnInit(): void {
    this.cargarCiudades();
  }

  cargarCiudades(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.ciudadesService.getCiudades().subscribe({
      next: (data) => {
        this.ciudades = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar ciudades', err);
        this.mensajeError = 'Error al cargar las ciudades.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.ciudadesFiltradas = term
      ? this.ciudades.filter((c) => c.nombre.toLowerCase().includes(term))
      : [...this.ciudades];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevaCiudad(): void {
    this.modoEdicion = false;
    this.ciudadSeleccionada = null;
    this.nombreCiudad = '';
  }

  editar(ciudad: Ciudad): void {
    this.modoEdicion = true;
    this.ciudadSeleccionada = ciudad;
    this.nombreCiudad = ciudad.nombre;
  }

  cancelarEdicion(): void {
    this.nuevaCiudad();
  }

  guardarCiudad(): void {
    const nombre = this.nombreCiudad.trim();
    if (!nombre) return;

    const payload = { nombre };

    if (this.modoEdicion && this.ciudadSeleccionada?.idCiudad != null) {
      this.ciudadesService.updateCiudad(this.ciudadSeleccionada.idCiudad, payload).subscribe({
        next: () => {
          this.cargarCiudades();
          this.nuevaCiudad();
        },
        error: (err) => {
          console.error('Error al actualizar ciudad', err);
          this.mensajeError = 'Error al actualizar la ciudad.';
        },
      });
    } else {
      this.ciudadesService.createCiudad(payload).subscribe({
        next: () => {
          this.cargarCiudades();
          this.nuevaCiudad();
        },
        error: (err) => {
          console.error('Error al crear ciudad', err);
          this.mensajeError = 'Error al crear la ciudad.';
        },
      });
    }
  }

  eliminar(ciudad: Ciudad): void {
    if (!ciudad.idCiudad) return;

    const confirmar = confirm(`¿Eliminar la ciudad "${ciudad.nombre}"?`);
    if (!confirmar) return;

    this.ciudadesService.deleteCiudad(ciudad.idCiudad).subscribe({
      next: () => this.cargarCiudades(),
      error: (err) => {
        console.error('Error al eliminar ciudad', err);
        this.mensajeError = 'Error al eliminar la ciudad.';
      },
    });
  }
}
