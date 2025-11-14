import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { UsuarioRequest } from '../models/usuario-request.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private baseUrl = `${environment.SERVER_BACK}/api/usuarios`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createUsuario(req: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, req, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUsuario(id: number, req: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, req, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
