import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Papa } from "ngx-papaparse";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Constants } from "../../assets/constants";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { MatIconModule } from "@angular/material/icon";
import { DataService } from "../shared/services/data.service";
import { PieChartComponent } from "../shared/components/pie-chart/pie-chart.component";
import {
  NullValuesLineChartComponent
} from "../shared/components/null-values-line-chart/null-values-line-chart.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  theme: ApexTheme;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-charts-page",
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, OwlDateTimeModule, MatIconModule, OwlNativeDateTimeModule, PieChartComponent, NullValuesLineChartComponent],
  templateUrl: "./charts-page.component.html",
  styleUrls: ["./charts-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChartsPageComponent {

  public mergedData: any;
  public averageData: any;

  public cities = Constants.Cities;
  public form = this.fb.group({
    alarmForm: this.fb.group({
      city: [""],
      dateStart: [new Date("2/24/2022, 05:00 PM")],
      dateEnd: [new Date("3/24/2022, 12:00 AM")],
      parameter: [""]
    })
  });

  public showChart = false;
  public pieChart = {
    series: [],
    labels: [''],
    startDate: '',
    endDate: ''
  };
  public nullValuesChart: any = {
    temperatureData: [],
    windSpeedData: [],
    cloudCoverData:[],
    startDate: '',
    endDate: '',
    city: ""
  };

  constructor(private papa: Papa,
              private fb: FormBuilder,
              public dataService: DataService,
              private changes: ChangeDetectorRef) {
    dataService.mergedData$.subscribe({
      next: (response) => {
        if (response) {
          this.mergedData = response;
          this.changes.detectChanges();
        }
      }
    });
  }
get startDate() {
    return new Date(this.form.get("alarmForm")?.get("dateStart")?.value as Date);
}
get endDate() {
  return new Date(this.form.get("alarmForm")?.get("dateEnd")?.value as Date)
}
  countAverage() {
    const cityAveragesMap = new Map<string, any>();
    for (const data of this.mergedData) {
      const { city, hour_cloudcover, hour_windspeed, hour_temp } = data;

      if (!cityAveragesMap.has(city)) {
        cityAveragesMap.set(city, {
          city,
          hour_cloudcover_avg: 0,
          hour_windspeed_avg: 0,
          hour_temp_avg: 0
        });
      }
      if (data.event_start_time) {
        // console.log(data);
      }

      const averages = cityAveragesMap.get(city)!;
      const count = Object.keys(averages).length - 1; // exclude city key

      averages.hour_cloudcover_avg =
        (averages.hour_cloudcover_avg * count + parseFloat(hour_cloudcover)) /
        (count + 1);
      averages.hour_windspeed_avg =
        (averages.hour_windspeed_avg * count + parseFloat(hour_windspeed)) /
        (count + 1);
      averages.hour_temp_avg =
        (averages.hour_temp_avg * count + parseFloat(hour_temp)) / (count + 1);
    }

    this.averageData = Array.from(cityAveragesMap.values());
    console.log(this.averageData);
  }
  public initCharts() {
    this.initPieChartData();
    this.initNullValuesChart('hour_temp');
    this.changes.detectChanges();
  }

  public initNullValuesChart(parameter) {
    const dateStartS = this.startDate.getTime() / 1000;
    const dateEndS = this.endDate.getTime() / 1000;
    const city = this.form.get("alarmForm")?.get("city")?.value as string;

    let data = this.mergedData.filter(record => (record.center_city_en === city && Number(record.hour_datetimeEpoch) >= dateStartS && Number(record.hour_datetimeEpoch) <= dateEndS));
    data = data.filter((item, index) => {
      return index == data.findIndex(obj => obj?.hour_datetimeEpoch === item?.hour_datetimeEpoch);
    });
 data.forEach(el => {
      this.nullValuesChart.temperatureData.push({
        x: (new Date(el.hour_datetimeEpoch * 1000)),
        y: el.event_start ? el.hour_temp : null
      })
   this.nullValuesChart.cloudCoverData.push({
     x: (new Date(el.hour_datetimeEpoch * 1000)),
     y: el.event_start ? el.hour_cloudcover : null
   })
   this.nullValuesChart.windSpeedData.push({
     x: (new Date(el.hour_datetimeEpoch * 1000)),
     y: el.event_start ? el.hour_windspeed : null
   })
    });
    const startDate = this.startDate.toLocaleString();
    const endDate = this.endDate.toLocaleString();
    this.nullValuesChart = {...this.nullValuesChart, startDate, endDate, city};
  };

  public initPieChartData() {
    const startDateS = this.startDate.getTime() / 1000;
    const endDateS = this.endDate.getTime() / 1000;
    const result: any = {};
    for (const rec of this.mergedData.filter(record => Number(record.hour_datetimeEpoch) >= startDateS && Number(record.hour_datetimeEpoch) <= endDateS)) {
      if (rec.event_start_hour) {
        const city = rec.center_city_en;
        result[city] = (result[city] || 0) + 1;
      }
    }
    const startDate = this.startDate.toLocaleString();
    const endDate = this.endDate.toLocaleString();
    console.log(result);
    this.pieChart = {
      series:Object.values(result),
      labels: Object.keys(result),
      startDate,
      endDate
    }
  }

  //3/1/2022, 12:00 AM
  //10/1/2022, 12:00 AM
}
