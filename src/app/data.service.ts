import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapComponent } from './map/map.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public dataSubject = new BehaviorSubject<any>([]);
  public dataObservable = this.dataSubject.asObservable();
  constructor() { }
}
