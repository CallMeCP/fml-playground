import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  //  Sync HTML component changes to Property Panel
  viewToProperty$: EventEmitter<any> = new EventEmitter();
  
  // Sync Property Panel changes to HTML component
  propertyToView$: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
