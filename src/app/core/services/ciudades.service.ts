import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ciudad } from '../models/ciudad.model';

@Injectable({ providedIn: 'root' })
export class CiudadesService {
  private baseUrl = `${environment.SERVER_BACK}/api/ciudades`;

  constructor(private http: HttpClient) {}

  getCiudades(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.baseUrl);
  }

  createCiudad(data: { nombre: string }): Observable<Ciudad> {
    return this.http.post<Ciudad>(this.baseUrl, data);
  }

  updateCiudad(id: number, data: { nombre: string }): Observable<Ciudad> {
    return this.http.put<Ciudad>(`${this.baseUrl}/${id}`, data);
  }

  deleteCiudad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
