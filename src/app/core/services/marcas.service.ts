import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Marca } from '../models/marca.model';

@Injectable({ providedIn: 'root' })
export class MarcasService {
  private baseUrl = `${environment.SERVER_BACK}/api/marcas`;

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.baseUrl);
  }

  createMarca(data: { nombre: string }): Observable<Marca> {
    return this.http.post<Marca>(this.baseUrl, data);
  }

  updateMarca(id: number, data: { nombre: string }): Observable<Marca> {
    return this.http.put<Marca>(`${this.baseUrl}/${id}`, data);
  }

  deleteMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
