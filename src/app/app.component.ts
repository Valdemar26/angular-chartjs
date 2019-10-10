import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { WeatherService } from './weather.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  chart = [];
  isDisabled = false;
  subscriptions: Subscription = new Subscription();
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
                fill: false
              },
              {
                data: temp_min,
                borderColor: '#ffcc00',
                fill: false
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
  }

  private subscribeForInputChanges(): void {
    const subscription = this.filtersControl.valueChanges.pipe(
      debounceTime(500)).subscribe((value) => {
      if (value && this.selectedFilter.autocomplete) {
        this.autocompleteResults$ = this.patientSearchService.getSearchAutocompleteResults(this.selectedFilter.key, value)
          .pipe(switchMap(() => this.patientSearchService.searchAutocompleteResults$));
      }
    });

    this.subscriptions.add(subscription);
  }

}
