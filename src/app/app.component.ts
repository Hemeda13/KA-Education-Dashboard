import { Component, ElementRef, OnInit, OnChanges, ViewChild } from '@angular/core';
import esriConfig from "@arcgis/core/config.js";
import { ECharts, EChartsOption } from 'echarts';
import { DataService } from './data.service';
import * as echarts from 'echarts';
import 'echarts/theme/dark.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  @ViewChild("chart1", { static: true }) chart1Ref!: ElementRef;
  @ViewChild("chart2", { static: true }) chart2Ref!: ElementRef;
  chart1!: ECharts;
  chart2!: ECharts;

  public isMenuOpen: boolean = false;
  chartOption: EChartsOption = {
    
    title: {
      text: 'Top Enrollment',
      textStyle:{
        color: 'white'
      }
      
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
    },
    series: [
    ]

  };

  chartOption2: EChartsOption = {
    title: {
      text: 'School Count',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: 300,
      max: 1000,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [

    ]
  };

  constructor(private dataService: DataService) { }


  public onSidenavClick(): void {
    this.isMenuOpen = false;
  }

  updateChart(data: []) {
      const sortedData = data.sort((a, b) => b["attributes"]["enrolment_sum"] - a["attributes"]["enrolment_sum"])

      const topFive: any = sortedData.slice(0, 5);
      this.chartOption.yAxis = {
        type: 'category',
        data: topFive.map((a: any) => a.attributes.STATE)
      };

      const totalEnrolmentSeries: any = {
        name: 'Total Enrolment',
        type: 'bar',
        data: topFive.map((a: any) => a.attributes.enrolment_sum)
      };
      const totalCountSeries: any = {
        name: 'Total Count',
        type: 'bar',
        data: topFive.map((a: any) => a.attributes.school_count)
      };

      this.chartOption.series = [
        totalEnrolmentSeries
      ]
      this.chart1.setOption(this.chartOption);
  }

  updateChartPie(data: []) {
      const sortedData = data.sort((a, b) => b["attributes"]["school_count"] - a["attributes"]["school_count"])

      const topFive: any = sortedData.slice(0, 5);
      this.chartOption2.series = [
        {
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: topFive.map((a: any) => {
            return {
              name: a.attributes.STATE,
              value: a.attributes.school_count
            }
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
      this.chart2.setOption(this.chartOption2);
    
  }

  ngOnInit(): void {
    esriConfig.assetsPath = "./assets";
    this.chart1 = echarts.init(this.chart1Ref.nativeElement, 'dark');
    this.chart2 = echarts.init(this.chart2Ref.nativeElement, 'dark');


    this.dataService.dataObservable.subscribe(event => {
      this.updateChart(event);
      this.updateChartPie(event);


    });

  }

}
