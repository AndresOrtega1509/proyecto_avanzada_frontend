export interface DetalleCompraRequest {
  idProducto: number;
  cantidad: number;
}

export interface CompraRequest {
  fecha: string;
  numeroFactura: string;
  idProveedor: number;
  idUsuario: number;
  detallesCompra: DetalleCompraRequest[];
}
