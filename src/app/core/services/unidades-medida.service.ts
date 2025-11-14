import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UnidadMedida } from '../models/unidad-medida.model';

@Injectable({ providedIn: 'root' })
export class UnidadesMedidaService {
  private baseUrl = `${environment.SERVER_BACK}/api/unidades-medida`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // LISTAR
  getUnidadesMedida(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // CREAR
  createUnidadMedida(data: UnidadMedida): Observable<UnidadMedida> {
    return this.http.post<UnidadMedida>(this.baseUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ACTUALIZAR
  updateUnidadMedida(id: number, data: UnidadMedida): Observable<UnidadMedida> {
    return this.http.put<UnidadMedida>(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ELIMINAR
  deleteUnidadMedida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
