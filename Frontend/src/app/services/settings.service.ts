import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SettingsResponse,
  AnswerTypesResponse,
  UpdateSettingsPayload,
  UpdateSettingsResponse
} from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:3000/api/settings';

  constructor(private http: HttpClient) {}

  /**
   * Obtener la configuración actual del sistema
   */
  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(this.apiUrl);
  }

  /**
   * Obtener todos los tipos de respuesta disponibles
   */
  getAnswerTypes(): Observable<AnswerTypesResponse> {
    return this.http.get<AnswerTypesResponse>(`${this.apiUrl}/answer-types`);
  }

  /**
   * Actualizar la configuración del sistema
   */
  updateSettings(payload: UpdateSettingsPayload): Observable<UpdateSettingsResponse> {
    return this.http.put<UpdateSettingsResponse>(this.apiUrl, payload);
  }
}
