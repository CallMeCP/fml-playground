import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlCheckbox } from './checkbox.interface';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {

  // Passed in from outside
  @Input() chkboxId;

  // Textfield default properties
  componentId: string;
  componentType: string = 'Checkbox';
  initX: number = 10;
  initY: number =10;
  x: number = 10;
  y: number = 10;
  width: number = 20;
  height: number = 20;
  bgColor: string = 'white';
  fontColor: string = 'black';
  fontSize: number = 12;
  zIndex: number = 100;
  deleted: boolean = false;
  borderSize: number = 1;
  symbolId: string = '';
  pfId: string = '';
  varId: string = '';
  comparison: string = '';
  compareTo: string = '';
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
    // Set Checkbox ID
    this.componentId = `CHECKBOX_${this.chkboxId}`;
    this.updateFinalFml();
  }

  emitNewValues() {
    const fmlCheckbox: FmlCheckbox = {
      componentId: this.componentId,
      componentType: this.componentType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      bgColor: this.bgColor,
      fontColor: this.fontColor,
      fontSize: this.fontSize,
      deleted: this.deleted,
      borderSize: this.borderSize,
      pfId: this.pfId,
      symbolId: this.symbolId,
      varId: this.varId,
      comparison: this.comparison,
      compareTo: this.compareTo
    };

    this.propertyService.viewToProperty$.emit(fmlCheckbox);
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
            this.width = properties.width;
            this.height = properties.height;
            this.bgColor = properties.bgColor;
            this.fontColor = properties.fontColor;
            this.fontSize = properties.fontSize;
            this.deleted = properties.deleted;
            this.borderSize = properties.borderSize;
            this.pfId = properties.pfId;
            this.symbolId = properties.symbolId;
            this.varId = properties.varId;
            this.comparison = properties.comparison;
            this.compareTo = properties.compareTo;
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
    this.propertyService.updateFmlCheckbox(
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
        deleted: this.deleted,
        borderSize: this.borderSize,
        pfId: this.pfId,
        symbolId: this.symbolId,
        varId: this.varId,
        comparison: this.comparison,
        compareTo: this.compareTo
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
