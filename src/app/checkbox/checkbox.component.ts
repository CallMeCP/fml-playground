import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlCheckbox } from './checkbox.interface';

// MODULE INDEX
// NAME               CONTENT
// constructor        empty
// ngOnInit           Load component or create new component
// emitNewValues      Push UI changes to Properties panel
// onWindowPress      Sync component properties to Panel and listen for Panel changes
// onWindowDrag       Push UI changes to Properties panel
// onWindowUp         Restore zIndex and disable dragable
// onResizing         Push UI changes to Properties panel
// updateFinalFml     Update current properties to service
// getBgColString     Return R.G.B string based on color name
// getFontColString   Return R.G.B string based on color name
// updatePos          Update display x and y position
// keyEvent           Use keyboard up, down, left, and right key to move component

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {

  // Passed in from outside
  @Input() chkboxId;
  @Input() chkboxProp;

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
  movable: boolean = true;
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

    if (this.chkboxProp.componentId != '') {
      this.componentId = this.chkboxProp.componentId;
      this.componentType = this.chkboxProp.componentType;
      this.x = this.chkboxProp.x;
      this.y = this.chkboxProp.y;
      this.width = this.chkboxProp.width;
      this.height = this.chkboxProp.height;
      this.bgColor = this.chkboxProp.bgColor;
      this.fontColor = this.chkboxProp.fontColor;
      this.fontSize = this.chkboxProp.fontSize;
      this.deleted = this.chkboxProp.deleted;
      this.borderSize = this.chkboxProp.borderSize;
      this.symbolId = this.chkboxProp.symbolId;
      this.pfId = this.chkboxProp.pfId;
      this.varId = this.chkboxProp.varId;
      this.comparison = `<${this.chkboxProp.comparison}>`;
      this.compareTo = this.chkboxProp.compareTo;
      this.movable = this.chkboxProp.movable;
      this.position = {x: this.x, y: this.y};
    }else {
      // Set Checkbox ID
      this.componentId = `CHECKBOX_${this.chkboxId}`;

      // Set new component position nearer to center
      this.x = this.propertyService.getCompStartXY().x - this.width/2;
      this.y = this.propertyService.getCompStartXY().y - this.height/2;
      this.position = {x: this.x, y: this.y};

      // Update final FML
      // this.updateFinalFml();
    }

    // Update final FML
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
      compareTo: this.compareTo,
      movable: this.movable
    };

    this.propertyService.viewToProperty$.emit(fmlCheckbox);
    this.updateFinalFml();
  }

  onWindowPress(event: MouseEvent) {
    this.zIndex = 999;

    // Set current active component
    this.propertyService.activeComponentId = this.componentId;

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
            this.deleted = properties.deleted;
            this.borderSize = properties.borderSize;
            this.pfId = properties.pfId;
            this.symbolId = properties.symbolId;
            this.varId = properties.varId;
            this.comparison = properties.comparison;
            this.compareTo = properties.compareTo;
            this.movable = properties.movable;
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
        compareTo: this.compareTo,
        movable: this.movable
      }
    );
  }

  getBgColString(): string {
    return this.propertyService.getColourString(this.bgColor);
  }

  getFontColString(): string {
    return this.propertyService.getColourString(this.fontColor);
  }

  updatePos() {
    this.position = {x: this.x, y: this.y};
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.propertyService.activeComponentId === this.componentId && this.movable==true) {
      // Left key
      if (event.keyCode === 37) {
        this.x--;
        this.updatePos();
        this.emitNewValues();
      }

      // Right key
      if (event.keyCode === 39) {
        this.x++;
        this.updatePos();
        this.emitNewValues();
      }

      // Up key
      if (event.keyCode === 38) {
        this.y--;
        this.updatePos();
        this.emitNewValues();
      }

      // Down key
      if (event.keyCode === 40) {
        this.y++;
        this.updatePos();
        this.emitNewValues();
      }
    }
  }

}
