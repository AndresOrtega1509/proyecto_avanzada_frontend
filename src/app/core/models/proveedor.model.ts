import { Ciudad } from './ciudad.model';

export interface Proveedor {
  idProveedor?: number;
  nombre: string;
  ciudad: Ciudad;
  direccion: string;
  email: string;
  estado: string | boolean;
  telefonos: string[];
}

export interface ProveedorRequest {
  nombre: string;
  idCiudad: number;
  direccion: string;
  email: string;
  estado: string | boolean;
  telefonos: string[];
}
