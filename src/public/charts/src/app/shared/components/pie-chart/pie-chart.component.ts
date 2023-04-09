import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChange, SimpleChanges,
  ViewChild
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent, NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  fill: ApexFill,
  dataLabels: ApexDataLabels
  labels: any;
  colors: any;
};
@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
  standalone: true,
  imports: [
    NgApexchartsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements OnChanges{
  @Input() data: any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  constructor(private changes: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      console.log(changes);
      console.log(this.data);
      this.chartOptions = {
        series: this.data.series,
        chart: {
          width: 800,
          type: "pie"
        },
        labels: this.data.labels,
        title: {
          text: `Number of raid alarms il all cities (${this.data.startDate} - ${this.data.endDate})`
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 800
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        colors: ['#FF5733', '#FFC300', '#C70039', '#4600ce', '#FF5733',
          '#01FF70', '#FFC300', '#FF4136', '#ca11ff', '#01FF70',
          '#FF851B', '#B10DC9', '#009fd9', '#FFDC00', '#F012BE',
          '#008510', '#FF4136', '#a84b00', '#01FF70', '#85144b',
          '#daa4c9', '#ffae00', '#FFDC00', '#0074D9']

      };
    }
  }
}
