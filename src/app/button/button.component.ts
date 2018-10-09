import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlButton } from '../interfaces/FmlButton.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  
  // Passed in from outside
  @Input() btnId;
  
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

  // Observable
  propToSrv$: Subscription;

  px: number;
  py: number;
  draggingWindow: boolean = false;

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    // Set Signature ID
    this.componentId = `BUTTON_${this.btnId}`;
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
      deleted: this.deleted
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
            this.buttonId = properties.buttonId;
            this.content = properties.content;
            this.deleted = properties.deleted;

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
        deleted: this.deleted
      }
    );
  }

}
