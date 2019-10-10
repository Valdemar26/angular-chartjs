import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable()
export class StatusInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    if (request.method === 'GET') {
      return next
        .handle(request)
        .pipe(
          catchError((err) => {
            if (err.error.cod === '404' && err.error.message === 'city not found') {
              console.log('error from Interceptor', err);
              return of(err.status);
            }
            // const error = err.error.message || err.statusText;
            // return throwError(error);
          })
        );
    }
  }
}
