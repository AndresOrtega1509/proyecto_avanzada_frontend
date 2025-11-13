import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol } from '../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private baseUrl = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createRol(data: { nombre: string; descripcion: string }): Observable<Rol> {
    return this.http.post<Rol>(this.baseUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateRol(id: number, data: { nombre: string; descripcion: string }): Observable<Rol> {
    return this.http.put<Rol>(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
