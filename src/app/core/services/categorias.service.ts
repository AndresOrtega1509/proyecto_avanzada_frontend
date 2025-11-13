import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private baseUrl = `${environment.apiUrl}/api/categorias`;

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  createCategoria(data: { nombre: string }): Observable<Categoria> {
    return this.http.post<Categoria>(this.baseUrl, data);
  }

  updateCategoria(id: number, data: { nombre: string }): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/${id}`, data);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
