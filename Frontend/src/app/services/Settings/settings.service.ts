import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SettingsResponse,
  AnswerTypesResponse,
  UpdateSettingsPayload,
  UpdateSettingsResponse
} from '../../components/configuration/model/settings.model';
import { env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${env.API_URL}/settings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(this.apiUrl);
  }

  getAnswerTypes(): Observable<AnswerTypesResponse> {
    return this.http.get<AnswerTypesResponse>(`${this.apiUrl}/answer-types`);
  }

  updateSettings(payload: UpdateSettingsPayload): Observable<UpdateSettingsResponse> {
    return this.http.put<UpdateSettingsResponse>(this.apiUrl, payload);
  }
}
