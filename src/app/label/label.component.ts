import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { Subscription } from 'rxjs';
import { FmlLabel } from './label.interface';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

  // Passed in from outside
  @Input() lblId;
  @Input() lblProp;

  // Label default properties
  componentId: string;
  componentType: string = 'Label';
  initX: number = 10;
  initY: number =10;
  x: number = 10;
  y: number = 10;
  width: number = 100;
  height: number = 50;
  bgColor: string = 'white';
  fontColor: string = 'black';
  fontSize: number = 12;
  fontFamily: string = 'times new roman';
  zIndex: number = 100;
  content: string = 'content';
  bold: boolean = false;
  italic: boolean = false;
  deleted: boolean = false;
  position: {x: number, y: number} = {x: this.x, y: this.y};

  // Observable
  propToSrv$: Subscription;

  px: number;
  py: number;
  draggingWindow: boolean = false;

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    if (this.lblProp.componentId != '') {
      this.componentId = this.lblProp.componentId;
      this.componentType = this.lblProp.componentType;
      this.x = this.lblProp.x;
      this.y = this.lblProp.y;
      this.width = this.lblProp.width;
      this.height = this.lblProp.height;
      this.content = this.lblProp.content;
      this.deleted = this.lblProp.deleted;
      this.bgColor = this.lblProp.bgColor;
      this.fontColor = this.lblProp.fontColor;
      this.fontSize = this.lblProp.fontSize;
      this.fontFamily = this.lblProp.fontFamily;
      this.bold = this.lblProp.bold;
      this.italic = this.lblProp.italic;
      this.position = {x: this.x, y: this.y};
    }else {
      // Set Label ID
      this.componentId = `LABEL_${this.lblId}`;
      
      // Set height based on current working page
      this.y = this.propertyService.getCompStartY();
      this.position = {x: this.x, y: this.y};

      // Update final FML
      this.updateFinalFml();
    }
  }

  emitNewValues() {
    const fmlLabel: FmlLabel = {
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
      content: this.content,
      bold: this.bold,
      italic: this.italic,
      deleted: this.deleted
    };

    this.propertyService.viewToProperty$.emit(fmlLabel);
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
    this.zIndex = 999;

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
            this.content = properties.content;
            this.bold = properties.bold;
            this.italic = properties.italic;
            this.deleted = properties.deleted;
            this.position = {x: this.x, y: this.y};

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
  
    // let offsetX = event.clientX - this.px;
    // let offsetY = event.clientY - this.py;

    // this.x += offsetX;
    // this.y += offsetY;
    // this.px = event.clientX;
    // this.py = event.clientY;

    this.x = event.x;
    this.y = event.y;

    this.emitNewValues();

  }

  onWindowUp(event: MouseEvent) {
    this.zIndex = 100;
    this.draggingWindow = false;
  }

  onResizing(event) {
    this.width = event.size.width;
    this.height = event.size.height;
  
    this.emitNewValues();
  }

  updateFinalFml() {
    this.propertyService.updateFmlLabel(
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
        content: this.content,
        bold: this.bold,
        italic: this.italic,
        deleted: this.deleted
      }
    );
  }

  getBgColString(): string {
    return this.propertyService.getColourString(this.bgColor);
  }

  getFontColString(): string {
    return this.propertyService.getColourString(this.fontColor);
  }

}
