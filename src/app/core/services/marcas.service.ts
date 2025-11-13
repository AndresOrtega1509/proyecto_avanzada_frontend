import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Marca } from '../models/marca.model';

@Injectable({ providedIn: 'root' })
export class MarcasService {
  private baseUrl = `${environment.apiUrl}/api/marcas`;

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.baseUrl);
  }
}
