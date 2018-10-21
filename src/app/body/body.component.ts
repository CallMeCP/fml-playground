import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { FmlBody } from '../interfaces/FmlBody.interface';
import { Observable, Subscription } from 'rxjs';

// MODULE INDEX
// NAME               CONTENT
// constructor        Empty
// ngOnInit           Load component or create new component
// drawGrid           Draw grids
// emitNewValues      Push UI changes to Properties panel
// resize             Not using anywhere
// onWindowPress      Sync component properties to Panel and listen for Panel changes
// onWindowDrag       Push UI changes to Properties panel
// onWindowUp         Restore zIndex and disable dragable
// onResizing         Push UI changes to Properties panel
// updateFinalFml     Update current properties to service
// getBgColString     Return R.G.B string based on color name
// getFontColString   Return R.G.B string based on color name

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  @Input() pageId;
  @Input() pageProp;

  // For grid line looping
  gridArr: number[] = [];
  showGrid: boolean = true;

  // Default values
  componentId: string;
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

    if (this.pageProp.componentId !== '') {
      this.showGrid = this.propertyService.showGrid;
      this.componentId = this.pageProp.componentId;
      this.componentType = this.pageProp.componentType;
      this.x = this.pageProp.x;
      this.y = this.pageProp.y;
      this.height = this.pageProp.height;
      this.width = this.pageProp.width;
      this.bgColor = this.pageProp.bgColor;
      this.fontColor = this.pageProp.fontColor;
      this.fontSize = this.pageProp.fontSize;
      this.fontFamily = this.pageProp.fontFamily==='times_roman'?'times new roman':this.pageProp.fontFamily;

    }else {
      // Set show grid
      this.showGrid = this.propertyService.showGrid;

      // Set Page ID
      this.componentId = `PAGE_${this.pageId}`;

      // Set position
      if (this.pageId == 1) {
        this.x = 10;
        this.y = 10;
      }else {
        this.x = 10;
        this.y = (this.pageId-1)*this.propertyService.fmlBodyProp[0].height+(10*this.pageId);
        this.width = this.propertyService.fmlBodyProp[0].width;
        this.height = this.propertyService.fmlBodyProp[0].height;
        this.bgColor = this.propertyService.fmlBodyProp[0].bgColor;
        this.fontColor = this.propertyService.fmlBodyProp[0].fontColor;
        this.fontFamily = this.propertyService.fmlBodyProp[0].fontFamily==='times_roman'?'times new roman':this.pageProp.fontFamily;

      }
    }

    // Draw Grids
    // this.drawGrid();

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

    // Update current working page
    const tok  = this.componentId.split('_');
    this.propertyService.updateCurrentPage(+tok[1]);

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

            // Update all pages
            if (this.componentId === 'PAGE_1') {
              this.propertyService.updatedPageProp();
            }
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
    // this.drawGrid();
  }

  getBgColString(): string {
    return this.propertyService.getColourString(this.bgColor);
  }

  getFontColString(): string {
    return this.propertyService.getColourString(this.fontColor);
  }

}
