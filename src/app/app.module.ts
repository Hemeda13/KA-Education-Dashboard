import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { AppUiModule } from './app-ui.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  
  declarations: [
    AppComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatSidenavModule,
    AppUiModule, 
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), 
    })
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
