import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Auth } from '../../services/Auth/auth';

/** Indica si ya hay un refresh en curso para no lanzar varios a la vez. */
let isRefreshing = false;

/**
 * Emite null mientras el refresh está pendiente.
 * Cuando finaliza, emite el nuevo token para que las peticiones
 * en espera puedan reintentarse automáticamente.
 */
const refreshToken$ = new BehaviorSubject<string | null>(null);

/** Clona la request añadiendo el Bearer token. */
function addToken(req: Parameters<HttpInterceptorFn>[0], token: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  const isAuthRequest = req.url.includes('/auth');
  const authReq = token && !isAuthRequest ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo manejar 401 y evitar bucle infinito si el propio refresh falla
      if (error.status !== 401 || req.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      // Caso 1: ya hay un refresh en curso → esperar y reintentar
      if (isRefreshing) {
        return refreshToken$.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((newToken) => next(addToken(req, newToken)))
        );
      }

      // Caso 2: iniciar el proceso de refresh
      isRefreshing = true;
      refreshToken$.next(null);

      return auth.refreshToken().pipe(
        switchMap((response: any) => {
          const newToken: string = response.access_token;
          auth.setToken(newToken);
          isRefreshing = false;
          refreshToken$.next(newToken);
          return next(addToken(req, newToken));
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          refreshToken$.next(null);
          auth.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
