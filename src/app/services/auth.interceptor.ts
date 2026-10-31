import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {AuthService} from './auth.service';

/** Meldet ab, sobald die API eine abgelaufene/ungültige Session meldet. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && auth.loggedIn()) {
        auth.sessionExpired();
      }
      return throwError(() => error);
    }),
  );
};
