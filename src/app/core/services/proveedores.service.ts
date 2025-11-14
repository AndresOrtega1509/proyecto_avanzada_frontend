import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Proveedor, ProveedorRequest } from '../models/proveedor.model';

@Injectable({ providedIn: 'root' })
export class ProveedoresService {
  private baseUrl = `${environment.SERVER_BACK}/api/proveedores`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createProveedor(req: ProveedorRequest): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.baseUrl, req, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProveedor(id: number, req: ProveedorRequest): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.baseUrl}/${id}`, req, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
