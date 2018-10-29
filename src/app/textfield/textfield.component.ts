import { Component, OnInit, Renderer2, ElementRef, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlTextField } from './textfield.interface';

// MODULE INDEX
// NAME               CONTENT
// constructor        Empty
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
  height: number = 25;
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
  textConv: string = 'TOUPPER';
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

    // Load component or create new component
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

      // Set new component position nearer to center
      this.x = this.propertyService.getCompStartXY().x - this.width/2;
      this.y = this.propertyService.getCompStartXY().y - this.height/2 + 0.5;
      this.position = {x: this.x, y: this.y};

      // Update final FML
      // this.updateFinalFml();
    }

    // Update final FML
    this.updateFinalFml();
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
    // Bring component to front most
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

  increasePosY(event: any) {
    this.y ++;
    this.position = {x: this.x, y: this.y};
    console.log(event);
    console.log('+ posY');

    this.emitNewValues();
  }

  updatePos() {
    this.position = {x: this.x, y: this.y};
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.propertyService.activeComponentId === this.componentId) {
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
