import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import {WeatherService} from '../weather.service';

@Injectable()
export class StatusInterceptor implements HttpInterceptor {

  constructor(private weather: WeatherService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    if (request.method === 'GET') {
      console.log(request);
      return next
        .handle(request)
        .pipe(
          catchError((err) => {
            if (err.error.cod === '404' && err.error.message === 'city not found') {
              console.log('error from Interceptor', err);
              this.weather.noData$.next(err.status);
              return of(err.status);
            }
            // const error = err.error.message || err.statusText;
            // return throwError(error);
          })
        );
    }
  }
}
