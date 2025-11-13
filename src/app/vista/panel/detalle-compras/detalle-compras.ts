import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DetalleComprasService } from '../../../core/services/detalle-compras.service';
import { ComprasService } from '../../../core/services/compras.service';
import { ProductosService } from '../../../core/services/productos.service';

import { DetalleCompra, Compra } from '../../../core/models/compra.model';
import { DetalleCompraRequest } from '../../../core/models/detalle-compra-request.model';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-detalle-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-compras.html',
  styleUrl: './detalle-compras.css',
})
export class DetalleComprasComponent implements OnInit {
  detalles: DetalleCompra[] = [];
  detallesFiltrados: DetalleCompra[] = [];

  compras: Compra[] = [];
  productos: Producto[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  detalleSeleccionado: DetalleCompra | null = null;

  form = {
    idCompra: null as number | null,
    idProducto: null as number | null,
    cantidad: null as number | null,
  };

  constructor(
    private detalleComprasService: DetalleComprasService,
    private comprasService: ComprasService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
    this.cargarDetalles();
  }

  cargarCombos(): void {
    this.comprasService.getCompras().subscribe({
      next: (data) => (this.compras = data),
      error: (err) => console.error('Error cargando compras', err),
    });

    this.productosService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error cargando productos', err),
    });
  }

  cargarDetalles(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.detalleComprasService.getDetalles().subscribe({
      next: (data) => {
        this.detalles = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar detalles de compra', err);
        this.mensajeError = 'Error al cargar los detalles de compra.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.detallesFiltrados = term
      ? this.detalles.filter(
          (d) =>
            d.producto?.nombre.toLowerCase().includes(term) ||
            this.getCompraDeDetalle(d)?.numeroFactura?.toString().toLowerCase().includes(term)
        )
      : [...this.detalles];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  // Busca la compra a la que pertenece un detalle (por idDetalleCompra)
  getCompraDeDetalle(detalle: DetalleCompra): Compra | undefined {
    return this.compras.find((c) =>
      c.detallesCompra?.some((d) => d.idDetalleCompra === detalle.idDetalleCompra)
    );
  }

  // Form helpers
  nueva(): void {
    this.modoEdicion = false;
    this.detalleSeleccionado = null;
    this.form = {
      idCompra: null,
      idProducto: null,
      cantidad: null,
    };
  }

  editar(detalle: DetalleCompra): void {
    this.modoEdicion = true;
    this.detalleSeleccionado = detalle;

    const compra = this.getCompraDeDetalle(detalle);

    this.form = {
      idCompra: compra?.idCompra ?? null,
      idProducto: detalle.producto?.idProducto ?? null,
      cantidad: detalle.cantidad,
    };
  }

  cancelar(): void {
    this.nueva();
  }

  guardar(): void {
    if (
      !this.form.idCompra ||
      !this.form.idProducto ||
      !this.form.cantidad ||
      this.form.cantidad <= 0
    ) {
      this.mensajeError = 'Compra, producto y cantidad (> 0) son obligatorios.';
      return;
    }

    this.mensajeError = '';

    const payload: DetalleCompraRequest = {
      idCompra: this.form.idCompra,
      idProducto: this.form.idProducto,
      cantidad: this.form.cantidad,
    };

    if (this.modoEdicion && this.detalleSeleccionado?.idDetalleCompra != null) {
      this.detalleComprasService
        .updateDetalle(this.detalleSeleccionado.idDetalleCompra, payload)
        .subscribe({
          next: () => {
            this.cargarDetalles();
            this.cargarCombos();
            this.nueva();
          },
          error: (err) => {
            console.error('Error al actualizar detalle', err);
            this.mensajeError = 'Error al actualizar el detalle.';
          },
        });
    } else {
      this.detalleComprasService.createDetalle(payload).subscribe({
        next: () => {
          this.cargarDetalles();
          this.cargarCombos();
          this.nueva();
        },
        error: (err) => {
          console.error('Error al crear detalle', err);
          this.mensajeError = 'Error al crear el detalle.';
        },
      });
    }
  }

  eliminar(detalle: DetalleCompra): void {
    if (!detalle.idDetalleCompra) return;

    const confirmar = confirm(
      `¿Eliminar el detalle #${detalle.idDetalleCompra} del producto "${detalle.producto?.nombre}"?`
    );
    if (!confirmar) return;

    this.detalleComprasService.deleteDetalle(detalle.idDetalleCompra).subscribe({
      next: () => {
        this.cargarDetalles();
        this.cargarCombos();
      },
      error: (err) => {
        console.error('Error al eliminar detalle', err);
        this.mensajeError = 'Error al eliminar el detalle.';
      },
    });
  }
}
