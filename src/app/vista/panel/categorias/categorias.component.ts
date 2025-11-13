import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  categoriaSeleccionada: Categoria | null = null;
  nombreCategoria = '';

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.mensajeError = 'Error al cargar las categorías.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.categoriasFiltradas = term
      ? this.categorias.filter((c) => c.nombre.toLowerCase().includes(term))
      : [...this.categorias];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevaCategoria(): void {
    this.modoEdicion = false;
    this.categoriaSeleccionada = null;
    this.nombreCategoria = '';
  }

  editar(categoria: Categoria): void {
    this.modoEdicion = true;
    this.categoriaSeleccionada = categoria;
    this.nombreCategoria = categoria.nombre;
  }

  cancelarEdicion(): void {
    this.nuevaCategoria();
  }

  guardarCategoria(): void {
    const nombre = this.nombreCategoria.trim();
    if (!nombre) return;

    const payload = { nombre };

    if (this.modoEdicion && this.categoriaSeleccionada?.idCategoria != null) {
      this.categoriasService
        .updateCategoria(this.categoriaSeleccionada.idCategoria, payload)
        .subscribe({
          next: () => {
            this.cargarCategorias();
            this.nuevaCategoria();
          },
          error: (err) => {
            console.error('Error al actualizar categoría', err);
            this.mensajeError = 'Error al actualizar la categoría.';
          },
        });
    } else {
      this.categoriasService.createCategoria(payload).subscribe({
        next: () => {
          this.cargarCategorias();
          this.nuevaCategoria();
        },
        error: (err) => {
          console.error('Error al crear categoría', err);
          this.mensajeError = 'Error al crear la categoría.';
        },
      });
    }
  }

  eliminar(categoria: Categoria): void {
    if (!categoria.idCategoria) return;

    const confirmar = confirm(`¿Eliminar la categoría "${categoria.nombre}"?`);
    if (!confirmar) return;

    this.categoriasService.deleteCategoria(categoria.idCategoria).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => {
        console.error('Error al eliminar categoría', err);
        this.mensajeError = 'Error al eliminar la categoría.';
      },
    });
  }
}
