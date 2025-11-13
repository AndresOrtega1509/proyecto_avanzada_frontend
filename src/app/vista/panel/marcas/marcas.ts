import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarcasService } from '../../../core/services/marcas.service';
import { Marca } from '../../../core/models/marca.model';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marcas.html',
  styleUrl: './marcas.css',
})
export class MarcasComponent implements OnInit {
  marcas: Marca[] = [];
  marcasFiltradas: Marca[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  marcaSeleccionada: Marca | null = null;
  nombreMarca = '';

  constructor(private marcasService: MarcasService) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.marcasService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar marcas', err);
        this.mensajeError = 'Error al cargar las marcas.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.marcasFiltradas = term
      ? this.marcas.filter((m) => m.nombre.toLowerCase().includes(term))
      : [...this.marcas];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevaMarca(): void {
    this.modoEdicion = false;
    this.marcaSeleccionada = null;
    this.nombreMarca = '';
  }

  editar(marca: Marca): void {
    this.modoEdicion = true;
    this.marcaSeleccionada = marca;
    this.nombreMarca = marca.nombre;
  }

  cancelarEdicion(): void {
    this.nuevaMarca();
  }

  guardarMarca(): void {
    const nombre = this.nombreMarca.trim();
    if (!nombre) {
      this.mensajeError = 'El nombre es obligatorio.';
      return;
    }

    this.mensajeError = '';

    const payload = { nombre };

    if (this.modoEdicion && this.marcaSeleccionada?.idMarca != null) {
      this.marcasService.updateMarca(this.marcaSeleccionada.idMarca, payload).subscribe({
        next: () => {
          this.cargarMarcas();
          this.nuevaMarca();
        },
        error: (err) => {
          console.error('Error al actualizar marca', err);
          this.mensajeError = 'Error al actualizar la marca.';
        },
      });
    } else {
      this.marcasService.createMarca(payload).subscribe({
        next: () => {
          this.cargarMarcas();
          this.nuevaMarca();
        },
        error: (err) => {
          console.error('Error al crear marca', err);
          this.mensajeError = 'Error al crear la marca.';
        },
      });
    }
  }

  eliminar(marca: Marca): void {
    if (!marca.idMarca) return;

    const confirmar = confirm(`¿Eliminar la marca "${marca.nombre}"?`);
    if (!confirmar) return;

    this.marcasService.deleteMarca(marca.idMarca).subscribe({
      next: () => this.cargarMarcas(),
      error: (err) => {
        console.error('Error al eliminar marca', err);
        this.mensajeError = 'Error al eliminar la marca.';
      },
    });
  }
}
