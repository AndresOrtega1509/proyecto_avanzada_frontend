import { Rol } from './rol.model';

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: Rol;
}
