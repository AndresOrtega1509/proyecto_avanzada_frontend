import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProveedorTelefono } from '../models/proveedor-telefono.model';
import { ProveedorTelefonoRequest } from '../models/proveedor-telefono-request.model';

@Injectable({ providedIn: 'root' })
export class ProveedorTelefonosService {
  private baseUrl = `${environment.SERVER_BACK}/api/proveedores-telefonos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getProveedorTelefonos(): Observable<ProveedorTelefono[]> {
    return this.http.get<ProveedorTelefono[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createProveedorTelefono(req: ProveedorTelefonoRequest): Observable<ProveedorTelefono> {
    return this.http.post<ProveedorTelefono>(this.baseUrl, req, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProveedorTelefono(
    id: number,
    req: ProveedorTelefonoRequest
  ): Observable<ProveedorTelefono> {
    return this.http.put<ProveedorTelefono>(`${this.baseUrl}/${id}`, req, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProveedorTelefono(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
