import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlSignature } from '../interfaces/FmlSignature.interface';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  // Passed in from outside
  @Input() sigId;

  // Signature default properties
  componentId: string;
  componentType: string = 'Signature';
  initX: number = 10;
  initY: number =10;
  x: number = 10;
  y: number = 10;
  width: number = 214;
  height: number = 63;
  weight: number = 5;
  bgColor: string = 'white';
  fontColor: string = 'black';  //  line color aka signature colour
  zIndex: number = 100;
  signatureId: string = 'NEW_APP_SIG_ID';
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
    // Set Signature ID
    this.componentId = `SIGNATURE_${this.sigId}`;
    this.updateFinalFml();
  }

  emitNewValues() {
    const fmlSignature: FmlSignature = {
      componentId: this.componentId,
      componentType: this.componentType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      weight: this.weight,
      bgColor: this.bgColor,
      fontColor: this.fontColor,
      signatureId: this.signatureId,
      deleted: this.deleted
    };

    this.propertyService.viewToProperty$.emit(fmlSignature);
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
            this.weight = properties.weight;
            this.bgColor = properties.bgColor;
            this.fontColor = properties.fontColor;
            this.signatureId = properties.signatureId;
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
    // this.zIndex = 999;

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
    this.propertyService.updateFmlSignature({
      componentId: this.componentId,
      componentType: this.componentType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      weight: this.weight,
      bgColor: this.bgColor,
      fontColor: this.fontColor,
      signatureId: this.signatureId,
      deleted: this.deleted
    });
  }

  getBgColString(): string {
    return this.propertyService.getColourString(this.bgColor);
  }

  getFontColString(): string {
    return this.propertyService.getColourString(this.fontColor);
  }

}
