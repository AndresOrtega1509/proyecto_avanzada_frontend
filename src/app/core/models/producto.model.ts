import { Categoria } from './categoria.model';
import { Marca } from './marca.model';
import { Impuesto } from './impuesto.model';
import { UnidadMedida } from './unidad-medida.model';

export interface Producto {
  idProducto?: number;
  nombre: string;
  categoria: Categoria;
  marca: Marca;
  unidadMedida: UnidadMedida;
  cantidadUnidadesMedidas: number;
  impuesto: Impuesto;
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
  estado: boolean;
}
