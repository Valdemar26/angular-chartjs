import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { }

  dailyForecast() {
    return this.http.get('http://api.openweathermap.org/data/2.5/forecast?id=524901&q=Lviv&APPID=1ec052023c49e1517c1f91424d764b7f&units=metric')
