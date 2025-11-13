import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { MarcasService } from '../../../core/services/marcas.service';
import { UnidadesMedidaService } from '../../../core/services/unidades-medida.service';
import { ImpuestosService } from '../../../core/services/impuestos.service';

import { Producto, ProductoRequest } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Marca } from '../../../core/models/marca.model';
import { UnidadMedida } from '../../../core/models/unidad-medida.model';
import { Impuesto } from '../../../core/models/impuesto.model';

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
  unidadesMedida: UnidadMedida[] = [];
  impuestos: Impuesto[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  productoSeleccionado: Producto | null = null;

  form: {
    nombre: string;
    idCategoria: number | null;
    idMarca: number | null;
    idUnidadMedida: number | null;
    cantidadUnidadesMedidas: number | null;
    idImpuesto: number | null;
    precio: number | null;
    stock: number | null;
    estado: 'ACTIVO' | 'INACTIVO';
  } = this.getFormInicial();

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private marcasService: MarcasService,
    private unidadesMedidaService: UnidadesMedidaService,
    private impuestosService: ImpuestosService
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
    this.cargarProductos();
  }

  private getFormInicial() {
    return {
      nombre: '',
      idCategoria: null,
      idMarca: null,
      idUnidadMedida: null,
      cantidadUnidadesMedidas: null,
      idImpuesto: null,
      precio: null,
      stock: null,
      estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
    };
  }

  cargarCombos(): void {
    this.categoriasService.getCategorias().subscribe((data) => (this.categorias = data));
    this.marcasService.getMarcas().subscribe((data) => (this.marcas = data));
    this.unidadesMedidaService
      .getUnidadesMedida()
      .subscribe((data) => (this.unidadesMedida = data));
    this.impuestosService.getImpuestos().subscribe((data) => (this.impuestos = data));
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
      ? this.productos.filter((p) => p.nombre.toLowerCase().includes(term))
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
    this.form = {
      nombre: producto.nombre,
      idCategoria: producto.categoria?.idCategoria ?? null,
      idMarca: producto.marca?.idMarca ?? null,
      idUnidadMedida: producto.unidadMedida?.idUnidadMedida ?? null,
      cantidadUnidadesMedidas: producto.cantidadUnidadesMedidas ?? null,
      idImpuesto: producto.impuesto?.idImpuesto ?? null,
      precio: producto.precio ?? null,
      stock: producto.stock ?? null,
      estado: (producto.estado as 'ACTIVO' | 'INACTIVO') ?? 'ACTIVO',
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
      this.form.cantidadUnidadesMedidas == null ||
      this.form.precio == null ||
      this.form.stock == null ||
      !this.form.idImpuesto
    ) {
      this.mensajeError = 'Todos los campos son obligatorios.';
      return;
    }

    this.mensajeError = '';

    const req: ProductoRequest = {
      nombre: this.form.nombre.trim(),
      idCategoria: this.form.idCategoria!,
      idMarca: this.form.idMarca!,
      idUnidadMedida: this.form.idUnidadMedida!,
      cantidadUnidadesMedidas: this.form.cantidadUnidadesMedidas!,
      idImpuesto: this.form.idImpuesto!,
      precio: this.form.precio!,
      stock: this.form.stock!,
      estado: this.form.estado,
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

  eliminar(producto: Producto): void {
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
