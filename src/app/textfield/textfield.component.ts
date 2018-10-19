import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlTextField } from './textfield.interface';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css']
})
export class TextfieldComponent implements OnInit {

  // Passed in from outside
  @Input() txtId;
  @Input() txtProp;

  // Textfield default properties
  componentId: string;
  componentType: string = 'Textfield';
  initX: number = 10;
  initY: number =10;
  x: number = 10;
  y: number = 10;
  width: number = 100;
  height: number = 20;
  bgColor: string = 'white';
  fontColor: string = 'black';
  fontSize: number = 12;
  fontFamily: string = 'times new roman';
  zIndex: number = 100;
  content: string = 'textfield';
  bold: boolean = false;
  italic: boolean = false;
  deleted: boolean = false;
  borderSize: number = 1;
  symbolId: string = '';
  pfId: string = '';
  textConv: string = 'TOLOWER';
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

    if (this.txtProp.componentId != '') {
      this.componentId = this.txtProp.componentId;
      this.componentType = this.txtProp.componentType;
      this.x = this.txtProp.x;
      this.y = this.txtProp.y;
      this.width = this.txtProp.width;
      this.height = this.txtProp.height;
      this.bgColor = this.txtProp.bgColor;
      this.fontColor = this.txtProp.fontColor;
      this.fontSize = this.txtProp.fontSize;
      this.fontFamily = this.txtProp.fontFamily==='times_roman'?'times new roman':this.txtProp.fontFamily;
      this.content = this.txtProp.content;
      this.bold = this.txtProp.bold;
      this.italic = this.txtProp.italic;
      this.deleted = this.txtProp.deleted;
      this.borderSize = this.txtProp.borderSize;
      this.symbolId = this.txtProp.symbolId;
      this.pfId = this.txtProp.pfId;
      this.textConv = this.txtProp.textConv;
      this.position = {x: this.x, y: this.y};
    }else {
      // Set Textfield ID
      this.componentId = `TEXTFIELD_${this.txtId}`;

      // Set height based on current working page
      this.y = this.propertyService.getCompStartY();
      this.position = {x: this.x, y: this.y};

      // Update final FML
      this.updateFinalFml();
    }
  }

  emitNewValues() {
    const fmlTextfield: FmlTextField = {
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
      deleted: this.deleted,
      borderSize: this.borderSize,
      pfId: this.pfId,
      symbolId: this.symbolId,
      textConv: this.textConv
    };

    this.propertyService.viewToProperty$.emit(fmlTextfield);
    this.updateFinalFml();
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
            this.borderSize = properties.borderSize;
            this.pfId = properties.pfId;
            this.symbolId = properties.symbolId;
            this.textConv = properties.textConv;
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
    this.propertyService.updateFmlTextfield(
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
        deleted: this.deleted,
        borderSize: this.borderSize,
        pfId: this.pfId,
        symbolId: this.symbolId,
        textConv: this.textConv
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
