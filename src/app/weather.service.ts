import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WeatherService {

  noData$: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  dailyForecast(actualCity) {
    return this.http.get(
      `http://api.openweathermap.org/data/2.5/forecast?id=524901&q=${actualCity}&APPID=1ec052023c49e1517c1f91424d764b7f&units=metric`
    );
  }

}
