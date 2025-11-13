import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Compra } from '../models/compra.model';
import { CompraRequest } from '../models/compra-request.model';

@Injectable({ providedIn: 'root' })
export class ComprasService {
  private baseUrl = `${environment.apiUrl}/api/compras`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createCompra(req: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(this.baseUrl, req, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCompra(id: number, req: CompraRequest): Observable<Compra> {
    return this.http.put<Compra>(`${this.baseUrl}/${id}`, req, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
