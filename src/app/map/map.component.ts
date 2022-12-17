import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import { DataService } from '../data.service';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']


})
export class MapComponent implements OnInit {
  constructor(private dataService: DataService){}
  ngOnInit(): void {

    const layer = new FeatureLayer({
      // URL to the service
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CollegesUniversities/FeatureServer/0"
    });

    const map = new Map({
      basemap: "satellite",
      layers: [layer]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map
    });
    

    const featureTable = new FeatureTable({
      view: view, // The view property must be set for the select/highlight to work
      layer: layer,
      container: "tableDiv"
    });

    reactiveUtils.watch(
      () => view.extent,
      () => {
        let query: any = layer.createQuery();

        query.outStatistics = [{
          onStatisticField: "TOT_ENROLL",
          outStatisticFieldName: "school_count",
          statisticType: "count"
        }, {
          onStatisticField: "TOT_ENROLL",
          outStatisticFieldName: "enrolment_sum",
          statisticType: "sum"
        }];
    
        query.groupByFieldsForStatistics = [ "STATE" ];
        query.geometry = view.extent;
    
        layer.queryFeatures(query)
          .then(((response : any) => {
            const dataz = response.features;
            this.dataService.dataSubject.next(dataz);
    
          }).bind(this));      });

    let query: any = layer.createQuery();

    query.outStatistics = [{
      onStatisticField: "TOT_ENROLL",
      outStatisticFieldName: "school_count",
      statisticType: "count"
    }, {
      onStatisticField: "TOT_ENROLL",
      outStatisticFieldName: "enrolment_sum",
      statisticType: "sum"
    }];

    query.groupByFieldsForStatistics = [ "STATE" ];

    layer.queryFeatures(query)
      .then(((response : any) => {
        const dataz = response.features;
        this.dataService.dataSubject.next(dataz);

      }).bind(this));


  }

}
