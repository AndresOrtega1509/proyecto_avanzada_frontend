import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DetalleCompra } from '../models/compra.model';
import { DetalleCompraRequest } from '../models/detalle-compra-request.model';

@Injectable({ providedIn: 'root' })
export class DetalleComprasService {
  private baseUrl = `${environment.apiUrl}/api/detalles-compra`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getDetalles(): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createDetalle(payload: DetalleCompraRequest): Observable<DetalleCompra> {
    return this.http.post<DetalleCompra>(this.baseUrl, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  updateDetalle(id: number, payload: DetalleCompraRequest): Observable<DetalleCompra> {
    return this.http.put<DetalleCompra>(`${this.baseUrl}/${id}`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteDetalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
