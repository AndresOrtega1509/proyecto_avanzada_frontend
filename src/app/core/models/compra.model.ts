import { Proveedor } from './proveedor.model';
import { Usuario } from './usuario.model';
import { Producto } from './producto.model';

export interface DetalleCompra {
  idDetalleCompra?: number;
  producto: Producto;
  cantidad: number;
}

export interface Compra {
  idCompra?: number;
  fecha: string;
  numeroFactura: string;
  proveedor: Proveedor;
  usuario: Usuario;
  detallesCompra: DetalleCompra[];
}
