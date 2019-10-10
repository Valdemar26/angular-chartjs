import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

import { WeatherService } from './weather.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  chart = [];
  subscriptions: Subscription = new Subscription();
  filtersControl: FormControl = new FormControl();

  // inputValue$ = Observable<string>;
  inputValue = '';

  @ViewChild('filtersInput', { static: false }) filtersInput: ElementRef<HTMLInputElement>;

  constructor(private weather: WeatherService) {}

  ngOnInit() {
    this.weather.dailyForecast()
      .subscribe(res => {

        const temp_max = res['list'].map(res => res.main.temp_max);
        const temp_min = res['list'].map(res => res.main.temp_min);
        const alldates = res['list'].map(res => res.dt);

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

      });

    this.subscribeForInputChanges();
  }

  private subscribeForInputChanges(): void {

    const subscription = this.filtersControl.valueChanges.pipe(
      debounceTime(500)).subscribe((value) => {
      // this.inputValue$ = value;
      this.inputValue = value;
      console.log(value);
    });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
