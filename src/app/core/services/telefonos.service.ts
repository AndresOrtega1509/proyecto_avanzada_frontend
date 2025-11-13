import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Telefono } from '../models/telefono.model';

@Injectable({ providedIn: 'root' })
export class TelefonosService {
  private baseUrl = `${environment.apiUrl}/api/telefonos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getTelefonos(): Observable<Telefono[]> {
    return this.http.get<Telefono[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createTelefono(data: { numero: string }): Observable<Telefono> {
    return this.http.post<Telefono>(this.baseUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateTelefono(id: number, data: { numero: string }): Observable<Telefono> {
    return this.http.put<Telefono>(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTelefono(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
