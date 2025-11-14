import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Impuesto } from '../models/impuesto.model';

@Injectable({ providedIn: 'root' })
export class ImpuestosService {
  private baseUrl = `${environment.SERVER_BACK}/api/impuestos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getImpuestos(): Observable<Impuesto[]> {
    return this.http.get<Impuesto[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createImpuesto(data: { nombre: string; porcentaje: number }): Observable<Impuesto> {
    return this.http.post<Impuesto>(this.baseUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateImpuesto(id: number, data: { nombre: string; porcentaje: number }): Observable<Impuesto> {
    return this.http.put<Impuesto>(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteImpuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
