import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UnidadMedida } from '../models/unidad-medida.model';

@Injectable({ providedIn: 'root' })
export class UnidadesMedidaService {
  private baseUrl = `${environment.apiUrl}/api/unidades-medida`;

  constructor(private http: HttpClient) {}

  getUnidadesMedida(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(this.baseUrl);
  }
}
