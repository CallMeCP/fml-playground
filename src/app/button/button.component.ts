import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlButton } from '../interfaces/FmlButton.interface';

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
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  
  // Passed in from outside
  @Input() btnId;
  @Input() btnProp;
  
  // Label default properties
  componentId: string;
  componentType: string = 'Button';
  initX: number = 10;
  initY: number =10;
  x: number = 10;
  y: number = 10;
  width: number = 100;
  height: number = 25;
  zIndex: number = 100;
  buttonId: string = 'NEXT'
  content: string = 'Button';
  tx: number = 0;
  deleted: boolean = false;
  position: {x: number, y: number} = {x: this.x, y: this.y};
  movable: boolean = true;

  // Observable
  propToSrv$: Subscription;

  px: number;
  py: number;
  draggingWindow: boolean = false;

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    if (this.btnProp.componentId != '') {
      this.componentId = this.btnProp.componentId;
      this.componentType = this.btnProp.componentType;
      this.x = this.btnProp.x;
      this.y = this.btnProp.y;
      this.width = this.btnProp.width;
      this.height = this.btnProp.height;
      this.buttonId = this.btnProp.buttonId;
      this.content = this.btnProp.content;
      this.deleted = this.btnProp.deleted;
      this.movable = this.btnProp.movable;
      this.position = {x: this.x, y: this.y};
    }else {
      // Set Signature ID
      this.componentId = `BUTTON_${this.btnId}`;

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
    const fmlButton: FmlButton = {
      componentId: this.componentId,
      componentType: this.componentType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      buttonId: this.buttonId,
      content: this.content,
      deleted: this.deleted,
      movable: this.movable
    };

    this.propertyService.viewToProperty$.emit(fmlButton);
    this.updateFinalFml();
  }

  resize() {
    this.x = ++this.x;
    this.y = ++this.y;
    this.width = ++this.width;
    this.height = ++this.height;
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
            this.buttonId = properties.buttonId;
            this.content = properties.content;
            this.deleted = properties.deleted;
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
    this.propertyService.updateFmlButton(
      {
        componentId: this.componentId,
        componentType: this.componentType,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        buttonId: this.buttonId,
        content: this.content,
        deleted: this.deleted,
        movable: this.movable
      }
    );
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
