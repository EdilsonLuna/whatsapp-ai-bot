import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { env } from '../../../environments/environment';
import { PermissionService } from '../Permission/permission.service';

export interface TokenPayload {
  userId: number;
  permisos: string[];
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private permissionService = inject(PermissionService);

  private readonly authEndpoint = '/auth';
  private readonly baseUrl = env.API_URL + this.authEndpoint;

  iniciarSesion(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/login', params, { withCredentials: true });
  }

  restablecerConstrasena(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/restablecer', params);
  }

  refreshToken(): Observable<any> {
    return this.http.post(this.baseUrl + '/refresh', {}, { withCredentials: true });
  }

  /** Guarda el token en localStorage. */
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token);
    }
  }

  /** Obtiene el token desde localStorage. */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('access_token');
  }

  /** Decodifica el payload del JWT sin validar la firma. */
  decodeToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as TokenPayload;
    } catch {
      return null;
    }
  }

  /** Lee los permisos del token y los carga en PermissionService. */
  loadPermissions(): void {
    const payload = this.decodeToken();
    if (payload?.permisos) {
      this.permissionService.setPermissions(payload.permisos);
    } else {
      this.permissionService.clear();
    }
  }

  /** Verifica si el token actual ha expirado. */
  isTokenExpired(): boolean {
    const payload = this.decodeToken();
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  /** Limpia token y permisos sin navegar. */
  clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }
    this.permissionService.clear();
  }

  /** Limpia sesión y redirige a login. */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
