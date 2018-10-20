import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertyService } from '../services/property.service';
import { FmlSignature } from '../interfaces/FmlSignature.interface';

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

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  // Passed in from outside
  @Input() sigId;
  @Input() sigProp;

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
  borderSize: number = 1;
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
    
    if (this.sigProp.componentId != '') {
      this.componentId = this.sigProp.componentId;
      this.componentType = this.sigProp.componentType;
      this.x = this.sigProp.x;
      this.y = this.sigProp.y;
      this.width = this.sigProp.width;
      this.height = this.sigProp.height;
      this.deleted = this.sigProp.deleted;
      this.bgColor = this.sigProp.bgColor;
      this.fontColor = this.sigProp.fontColor;
      this.weight = this.sigProp.weight;
      this.signatureId = this.sigProp.signatureId;
      this.borderSize = this.sigProp.borderSize;
      this.position = {x: this.x, y: this.y};
    }else {
      // Set Signature ID
      this.componentId = `SIGNATURE_${this.sigId}`;

      // Set height based on current working page
      this.y = this.propertyService.getCompStartY();
      this.position = {x: this.x, y: this.y};

      // Update final FML
      // this.updateFinalFml();
    }

    // Update final FML
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
      borderSize: this.borderSize,
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
            this.borderSize = +properties.borderSize;
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
      borderSize: this.borderSize,
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
