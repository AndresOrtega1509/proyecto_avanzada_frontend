import { Proveedor } from './proveedor.model';
import { Telefono } from './telefono.model';

export interface ProveedorTelefono {
  idProveedoresTelefonos?: number;
  proveedor?: Proveedor;
  telefono?: Telefono;

  idProveedor?: number;
  idTelefono?: number;
}
