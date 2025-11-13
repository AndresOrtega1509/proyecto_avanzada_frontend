import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComprasService } from '../../../core/services/compras.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { ProductosService } from '../../../core/services/productos.service';
import { UsuariosService } from '../../../core/services/usuarios.service';

import { Compra, DetalleCompra } from '../../../core/models/compra.model';
import { CompraRequest, DetalleCompraRequest } from '../../../core/models/compra-request.model';
import { Proveedor } from '../../../core/models/proveedor.model';
import { Producto } from '../../../core/models/producto.model';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class ComprasComponent implements OnInit {
  compras: Compra[] = [];
  comprasFiltradas: Compra[] = [];

  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  usuarios: Usuario[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  compraSeleccionada: Compra | null = null;

  form = {
    fecha: '',
    numeroFactura: '',
    idProveedor: null as number | null,
    idUsuario: null as number | null,
  };

  detallesUI: {
    idProducto: number | null;
    producto?: Producto;
    cantidad: number | null;
  }[] = [];

  constructor(
    private comprasService: ComprasService,
    private proveedoresService: ProveedoresService,
    private productosService: ProductosService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
    this.cargarCompras();
    this.agregarDetalle();
  }

  cargarCombos(): void {
    this.proveedoresService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => console.error('Error cargando proveedores', err),
    });

    this.productosService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error cargando productos', err),
    });

    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;

        const loggedUsername = localStorage.getItem('username');
        // Solo auto-asignamos si aún no hay usuario en el formulario
        if (loggedUsername && !this.form.idUsuario) {
          const usuarioActual = data.find((u) => u.email === loggedUsername);
          if (usuarioActual?.idUsuario != null) {
            this.form.idUsuario = usuarioActual.idUsuario;
          }
        }
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  cargarCompras(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.comprasService.getCompras().subscribe({
      next: (data) => {
        this.compras = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar compras', err);
        this.mensajeError = 'Error al cargar las compras.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.comprasFiltradas = term
      ? this.compras.filter(
          (c) =>
            c.numeroFactura.toLowerCase().includes(term) ||
            c.proveedor?.nombre.toLowerCase().includes(term)
        )
      : [...this.compras];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  formatearFecha(fecha: string): string {
    // para mostrar en la tabla
    if (!fecha) return '';
    return fecha.substring(0, 10);
  }

  // Subtotal sin impuesto (precio * cantidad)
  calcularSubtotal(det: { producto?: Producto; cantidad: number | null }): number {
    if (!det.producto || !det.cantidad) return 0;
    return det.producto.precio * det.cantidad;
  }

  // Total de una compra (suma de cada detalle con impuesto)
  calcularTotalCompra(compra: Compra): number {
    if (!compra.detallesCompra) return 0;

    return compra.detallesCompra.reduce((acc, d) => {
      const base = d.producto.precio * d.cantidad;
      const porcentaje = d.producto.impuesto?.porcentaje ?? 0;
      const totalConImpuesto = base * (1 + porcentaje / 100);
      return acc + totalConImpuesto;
    }, 0);
  }

  // Total del formulario actual (sumando cada detalle + impuesto)
  calcularTotalFormulario(): number {
    return this.detallesUI.reduce((acc, d) => {
      if (!d.producto || !d.cantidad) return acc;
      const base = d.producto.precio * d.cantidad;
      const porcentaje = d.producto.impuesto?.porcentaje ?? 0;
      const totalConImpuesto = base * (1 + porcentaje / 100);
      return acc + totalConImpuesto;
    }, 0);
  }

  agregarDetalle(): void {
    this.detallesUI.push({
      idProducto: null,
      producto: undefined,
      cantidad: null,
    });
  }

  eliminarDetalle(index: number): void {
    this.detallesUI.splice(index, 1);
    if (this.detallesUI.length === 0) {
      this.agregarDetalle();
    }
  }

  onCambiarProducto(
    detalle: { idProducto: number | null; producto?: Producto },
    id: number | null
  ): void {
    detalle.idProducto = id;

    // Si no seleccionan nada, limpia el producto
    if (id == null) {
      detalle.producto = undefined;
      return;
    }

    const prod = this.productos.find((p) => p.idProducto === id);
    detalle.producto = prod; // será undefined si no lo encuentra, y está bien
  }

  // Formulario
  nuevaCompra(): void {
    this.modoEdicion = false;
    this.compraSeleccionada = null;
    this.form = {
      fecha: '',
      numeroFactura: '',
      idProveedor: null,
      idUsuario: null,
    };
    this.detallesUI = [];
    this.agregarDetalle();
  }

  editarCompra(compra: Compra): void {
    this.modoEdicion = true;
    this.compraSeleccionada = compra;

    this.form = {
      fecha: this.formatearFecha(compra.fecha),
      numeroFactura: compra.numeroFactura,
      idProveedor: compra.proveedor?.idProveedor ?? null,
      idUsuario: compra.usuario?.idUsuario ?? null,
    };

    this.detallesUI = compra.detallesCompra.map((d) => ({
      idProducto: d.producto?.idProducto ?? null,
      producto: d.producto,
      cantidad: d.cantidad,
    }));

    if (this.detallesUI.length === 0) {
      this.agregarDetalle();
    }
  }

  cancelarEdicion(): void {
    this.nuevaCompra();
  }

  guardarCompra(): void {
    if (
      !this.form.fecha ||
      !this.form.numeroFactura.trim() ||
      !this.form.idProveedor ||
      !this.form.idUsuario
    ) {
      this.mensajeError = 'Fecha, número de factura, proveedor y usuario son obligatorios.';
      return;
    }

    const detallesValidos = this.detallesUI.filter(
      (d) => d.idProducto && d.cantidad && d.cantidad > 0
    );

    if (detallesValidos.length === 0) {
      this.mensajeError = 'Debe agregar al menos un producto con cantidad.';
      return;
    }

    const detallesRequest: DetalleCompraRequest[] = detallesValidos.map((d) => ({
      idProducto: d.idProducto!,
      cantidad: d.cantidad!,
    }));

    const req: CompraRequest = {
      fecha: this.form.fecha,
      numeroFactura: this.form.numeroFactura.trim(),
      idProveedor: this.form.idProveedor!,
      idUsuario: this.form.idUsuario!,
      detallesCompra: detallesRequest,
    };

    this.mensajeError = '';

    if (this.modoEdicion && this.compraSeleccionada?.idCompra != null) {
      this.comprasService.updateCompra(this.compraSeleccionada.idCompra, req).subscribe({
        next: () => {
          this.cargarCompras();
          this.nuevaCompra();
        },
        error: (err) => {
          console.error('Error al actualizar compra', err);
          this.mensajeError = 'Error al actualizar la compra.';
        },
      });
    } else {
      this.comprasService.createCompra(req).subscribe({
        next: () => {
          this.cargarCompras();
          this.nuevaCompra();
        },
        error: (err) => {
          console.error('Error al crear compra', err);
          this.mensajeError = 'Error al crear la compra.';
        },
      });
    }
  }

  eliminarCompra(compra: Compra): void {
    if (!compra.idCompra) return;

    const confirmar = confirm(
      `¿Eliminar la compra #${compra.idCompra} (factura ${compra.numeroFactura})?`
    );
    if (!confirmar) return;

    this.comprasService.deleteCompra(compra.idCompra).subscribe({
      next: () => this.cargarCompras(),
      error: (err) => {
        console.error('Error al eliminar compra', err);
        this.mensajeError = 'Error al eliminar la compra.';
      },
    });
  }
}
