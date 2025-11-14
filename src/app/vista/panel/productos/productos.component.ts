import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { MarcasService } from '../../../core/services/marcas.service';
import { ImpuestosService } from '../../../core/services/impuestos.service';
import { UnidadesMedidaService } from '../../../core/services/unidades-medida.service';

import { Producto, ProductoRequest } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Marca } from '../../../core/models/marca.model';
import { Impuesto } from '../../../core/models/impuesto.model';
import { UnidadMedida } from '../../../core/models/unidad-medida.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  impuestos: Impuesto[] = [];
  unidadesMedida: UnidadMedida[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  productoSeleccionado: Producto | null = null;

  form: {
    nombre: string;
    idCategoria: number | null;
    idMarca: number | null;
    idImpuesto: number | null;
    idUnidadMedida: number | null;
    cantidadUnidadesMedidas: number;
    precio: number;
    stock: number;
    estado: 'ACTIVO' | 'INACTIVO';
  } = this.getFormInicial();

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private marcasService: MarcasService,
    private impuestosService: ImpuestosService,
    private unidadesService: UnidadesMedidaService
  ) {}

  ngOnInit(): void {
    this.cargarListas();
    this.cargarProductos();
  }

  private getFormInicial() {
    return {
      nombre: '',
      idCategoria: null,
      idMarca: null,
      idImpuesto: null,
      idUnidadMedida: null,
      cantidadUnidadesMedidas: 1,
      precio: 0,
      stock: 0,
      estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
    };
  }

  cargarListas(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });

    this.marcasService.getMarcas().subscribe({
      next: (data) => (this.marcas = data),
      error: (err) => console.error('Error al cargar marcas', err),
    });

    this.impuestosService.getImpuestos().subscribe({
      next: (data) => (this.impuestos = data),
      error: (err) => console.error('Error al cargar impuestos', err),
    });

    this.unidadesService.getUnidadesMedida().subscribe({
      next: (data) => (this.unidadesMedida = data),
      error: (err) => console.error('Error al cargar unidades de medida', err),
    });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.mensajeError = 'Error al cargar los productos.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.productosFiltrados = term
      ? this.productos.filter((p) => {
          const nombre = p.nombre?.toLowerCase() ?? '';
          const categoria = p.categoria?.nombre?.toLowerCase() ?? '';
          const marca = p.marca?.nombre?.toLowerCase() ?? '';
          return nombre.includes(term) || categoria.includes(term) || marca.includes(term);
        })
      : [...this.productos];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevoProducto(): void {
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.form = this.getFormInicial();
  }

  editar(producto: Producto): void {
    this.modoEdicion = true;
    this.productoSeleccionado = producto;

    const esActivo = producto.estado === true || producto.estado === 'ACTIVO';

    this.form = {
      nombre: producto.nombre,
      idCategoria: producto.categoria?.idCategoria ?? null,
      idMarca: producto.marca?.idMarca ?? null,
      idImpuesto: producto.impuesto?.idImpuesto ?? null,
      idUnidadMedida: producto.unidadMedida?.idUnidadMedida ?? null,
      cantidadUnidadesMedidas: producto.cantidadUnidadesMedidas ?? 1,
      precio: producto.precio ?? 0,
      stock: producto.stock ?? 0,
      estado: esActivo ? 'ACTIVO' : 'INACTIVO',
    };
  }

  cancelarEdicion(): void {
    this.nuevoProducto();
  }

  guardarProducto(): void {
    if (
      !this.form.nombre.trim() ||
      !this.form.idCategoria ||
      !this.form.idMarca ||
      !this.form.idUnidadMedida ||
      !this.form.idImpuesto
    ) {
      this.mensajeError = 'Nombre, categoría, marca, unidad, impuesto y stock son obligatorios.';
      return;
    }

    if (this.form.stock < 0) {
      this.mensajeError = 'El stock no puede ser negativo.';
      return;
    }

    this.mensajeError = '';

    const estadoBool = this.form.estado === 'ACTIVO';

    const req: ProductoRequest = {
      nombre: this.form.nombre.trim(),
      idCategoria: this.form.idCategoria!,
      idMarca: this.form.idMarca!,
      idUnidadMedida: this.form.idUnidadMedida!,
      cantidadUnidadesMedidas: this.form.cantidadUnidadesMedidas,
      idImpuesto: this.form.idImpuesto!,
      precio: this.form.precio,
      stock: this.form.stock,
      estado: estadoBool,
    };

    if (this.modoEdicion && this.productoSeleccionado?.idProducto != null) {
      this.productosService.updateProducto(this.productoSeleccionado.idProducto, req).subscribe({
        next: () => {
          this.cargarProductos();
          this.nuevoProducto();
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
          this.mensajeError = 'Error al actualizar el producto.';
        },
      });
    } else {
      this.productosService.createProducto(req).subscribe({
        next: () => {
          this.cargarProductos();
          this.nuevoProducto();
        },
        error: (err) => {
          console.error('Error al crear producto', err);
          this.mensajeError = 'Error al crear el producto.';
        },
      });
    }
  }

  eliminarProducto(producto: Producto): void {
    if (!producto.idProducto) return;

    const confirmar = confirm(`¿Eliminar el producto "${producto.nombre}"?`);
    if (!confirmar) return;

    this.productosService.deleteProducto(producto.idProducto).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => {
        console.error('Error al eliminar producto', err);
        this.mensajeError = 'Error al eliminar el producto.';
      },
    });
  }
}
