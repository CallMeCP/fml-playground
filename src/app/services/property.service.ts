import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  properties$: EventEmitter<any> = new EventEmitter();
  propertyToView$: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
