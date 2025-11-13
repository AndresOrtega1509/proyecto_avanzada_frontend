import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoRequest } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private baseUrl = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createProducto(req: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, req, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProducto(id: number, req: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, req, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
