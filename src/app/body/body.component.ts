import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { FmlBody } from '../interfaces/FmlBody.interface';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  // Default values
  componentId: string = "BODY_1";   //  Hardcode, as there is only always one body container
  componentType: string = "Body";
  // x: number = 160 + 20;
  // y: number = 64 + 20;
  x: number = 10;
  y: number = 10;
  width: number = 800;
  height: number = 600;
  bgColor: string = "white";
  fontColor: string = 'black';
  fontSize: number = 12;
  fontFamily: string = 'times new roman';

  // Observable
  propToSrv$: Subscription;

  px: number;
  py: number;
  draggingWindow: boolean = false;

  counter: number = 0;

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    this.updateFinalFml();
  }

  emitNewValues() {
    const fmlBody: FmlBody = {
      componentId: this.componentId,
      componentType: this.componentType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      bgColor: this.bgColor,
      fontColor: this.fontColor,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
    };

    this.propertyService.viewToProperty$.emit(fmlBody);
    this.updateFinalFml();
  }

  resize() {
    // this.text = (++this.counter).toString();
    this.x = ++this.x;
    this.y = ++this.y;
    this.width = ++this.width;
    this.height = ++this.height;
  }

  onWindowPress(event: MouseEvent) {
    // console.log("pressing");
    // Emit new values
    this.emitNewValues();

    // Listen to Properties panel changes
    if(this.propToSrv$ === null || this.propToSrv$ === undefined) {
      
      this.propToSrv$ = this.propertyService.propertyToView$.subscribe(
        properties => {
          
          if (properties.componentId !== this.componentId) {
            this.propToSrv$.unsubscribe();
            this.propToSrv$ = undefined;
          }else {
            // Set properties
            this.componentType = properties.componentType;
            this.x = properties.x;
            this.y = properties.y;
            this.width = properties.width;
            this.height = properties.height;
            this.bgColor = properties.bgColor;
            this.fontColor = properties.fontColor;
            this.fontSize = properties.fontSize;
            this.fontFamily = properties.fontFamily;

            // Update final FML
            this.updateFinalFml();
          }
        }
      );
    }

    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    // console.log("drag");
    if (!this.draggingWindow) {
      return;
    }
    // console.log("real drag");
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;

    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;

    this.emitNewValues();

  }

  onWindowUp(event: MouseEvent) {
    this.draggingWindow = false;
  }

  updateFinalFml() {
    this.propertyService.updateFmlBody(
      {
        componentId: this.componentId,
        componentType: this.componentType,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        bgColor: this.bgColor,
        fontColor: this.fontColor,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily==='times new roman'?'times_roman':this.fontFamily,
      }
    );
  }

}
