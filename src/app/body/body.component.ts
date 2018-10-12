import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { FmlBody } from '../interfaces/FmlBody.interface';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  @Input() pageId;

  // For grid line looping
  gridArr: number[] = [];

  // Default values
  componentId: string;   //  Hardcode, as there is only always one body container
  componentType: string = "Page";
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

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    // Set Page ID
    this.componentId = `PAGE_${this.pageId}`;

    // Set position
    if (this.pageId == 1) {
      this.x = 10;
      this.y = 10;
    }else {
      // this.x = this.pageId*this.width;
      this.x = 10;
      this.y = (this.pageId-1)*this.propertyService.fmlBodyProp[0].height+(10*this.pageId-1);
      this.width = this.propertyService.fmlBodyProp[0].width;
    }


    // Draw Grids
    this.drawGrid();

    // Update Global FML
    this.updateFinalFml();
  }

  drawGrid() {
    // Init grids array
    this.gridArr = [];
    const totalSquares = Math.floor(this.width/ 10) * Math.floor(this.height/10);
    for (let index = 0; index < totalSquares; index++) {
      this.gridArr.push(1);
    }
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
    this.x = ++this.x;
    this.y = ++this.y;
    this.width = ++this.width;
    this.height = ++this.height;
  }

  onWindowPress(event: MouseEvent) {
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
            this.x = +properties.x;
            this.y = +properties.y;
            this.width = +properties.width;
            this.height = +properties.height;
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
    if (!this.draggingWindow) {
      return;
    }
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

    // Redraw grids
    this.drawGrid();
  }

  getBgColString(): string {
    return this.propertyService.getColourString(this.bgColor);
  }

  getFontColString(): string {
    return this.propertyService.getColourString(this.fontColor);
  }

}
