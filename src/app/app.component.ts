import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { Chart } from 'chart.js';

import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  chart = [];
  subscriptions: Subscription = new Subscription();
  filtersControl: FormControl = new FormControl();

  inputValue = '';
  res;

  @ViewChild('filtersInput', { static: false }) filtersInput: ElementRef<HTMLInputElement>;

  constructor(private weather: WeatherService) {}

  ngOnInit() {
    this.initCurrentCityWeather('Odessa');
    this.subscribeForInputChanges();
    this.weather.noData$.subscribe(
      data => this.res = data
    )
  }

  private initCurrentCityWeather(city) {
    this.weather.dailyForecast(city)
      .pipe(
        tap((data) => console.log('NO DATA:', data) ),
        catchError(err => of('get error!!!')),
      )
      .subscribe(response => {
        this.res = ''
        console.log(response);

        console.log('response from server', response);

        const temp_max = response['list'].map(res => res.main.temp_max);
        const temp_min = response['list'].map(res => res.main.temp_min);
        const alldates = response['list'].map(res => res.dt);

        const weatherDates = [];
        alldates.forEach((res) => {
          const jsdate = new Date(res * 1000);
          weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric'}));
        });

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: weatherDates,
            datasets: [
              {
                data: temp_max,
                borderColor: '#3cba9f',
                fill: true
              },
              {
                data: temp_min,
                borderColor: '#ffcc00',
                fill: true
              },
            ]
          },
          options: {
            legend: {
              display: false,
            },

            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }]
            }
          }
        });
      },
      error => {
        // this.res = error
        console.log(error);
      });
  }

  private subscribeForInputChanges(): void {

    const subscription = this.filtersControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((value) => {
      // this.inputValue$ = value;
      this.inputValue = value;
      this.initCurrentCityWeather(value);
    });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
