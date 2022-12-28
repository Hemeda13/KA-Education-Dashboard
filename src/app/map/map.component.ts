import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { DataService } from '../data.service';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import * as clusterLabelCreator from "@arcgis/core/smartMapping/labels/clusters";






@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']


})
export class MapComponent implements OnInit {
  constructor(private dataService: DataService) { }
  ngOnInit(): void {

  
    const layer = new FeatureLayer({
      // URL to the service
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CollegesUniversities/FeatureServer/0",
      definitionExpression: ("TYPE='2' OR TYPE='3'"),

    });

    const map = new Map({
      basemap: "satellite",
      layers: [layer]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map
      
    });

    
  layer.featureReduction={
    type: "cluster",
    clusterRadius: "200px",
    clusterMinSize: "50px",
    clusterMaxSize: "150px",
    
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: {
        expression: "Text($feature.cluster_count, '#,###')"
      },
      symbol: {
        type: "text",
        color: "#00000",
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "12px"
        }
      },
      labelPlacement: "center-center",
    }]
  }  as any;

  






    let popupTemplate = new PopupTemplate({
      // autocasts as new PopupTemplate()
      title: "{NAME}",
      outFields: ["*"],
      content: [{
        // It is also possible to set the fieldInfos outside of the content
        // directly in the popupTemplate. If no fieldInfos is specifically set
        // in the content, it defaults to whatever may be set within the popupTemplate.
        type: "fields",
        fieldInfos: [{
          fieldName: "TOT_ENROLL",
          label: "Total Enrollment"
        }, {
          fieldName: "TOT_EMPLOY",
          label: "Employers",
          format: {
            digitSeparator: true,
            places: 0
          }
        }]
      }]
    });
    layer.popupTemplate = popupTemplate;






    const featureTable = new FeatureTable({
      view: view, // The view property must be set for the select/highlight to work
      layer: layer,
      container: "tableDiv",
      multiSortEnabled: true,
      tableTemplate: { // autocasts to TableTemplate
        columnTemplates: [ // takes an array of FieldColumnTemplate and GroupColumnTemplate
          { // autocasts to FieldColumnTemplate
            type: "field",
            fieldName: "TYPE",
            label: "Type",
          },
          {
            type: "field",
            fieldName: "STATE",
            label: "State"
          },
          {
            type: "field",
            fieldName: "NAME",
            label: "School Name",
          },
          {
            type: "field",
            fieldName: "TOT_ENROLL",
            label: "Enrollment",
          }]
      },
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

        query.groupByFieldsForStatistics = ["STATE"];
        query.geometry = view.extent;

        layer.queryFeatures(query)
          .then(((response: any) => {
            const dataz = response.features;
            this.dataService.dataSubject.next(dataz);

          }).bind(this));
      });

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

    query.groupByFieldsForStatistics = ["STATE"];

    layer.queryFeatures(query)
      .then(((response: any) => {
        const dataz = response.features;
        this.dataService.dataSubject.next(dataz);

      }).bind(this));


  }

}
