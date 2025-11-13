import { Categoria } from './categoria.model';
import { Marca } from './marca.model';
import { UnidadMedida } from './unidad-medida.model';
import { Impuesto } from './impuesto.model';

export interface Producto {
  idProducto?: number;
  nombre: string;
  categoria?: Categoria | null;
  marca?: Marca | null;
  unidadMedida?: UnidadMedida | null;
  cantidadUnidadesMedidas: number;
  impuesto?: Impuesto | null;
  precio: number;
  stock: number;
  estado: boolean | string;
}

export interface ProductoRequest {
  nombre: string;
  idCategoria: number;
  idMarca: number;
  idUnidadMedida: number;
  cantidadUnidadesMedidas: number;
  idImpuesto: number;
  precio: number;
  stock: number;
  estado: boolean | string;
}
