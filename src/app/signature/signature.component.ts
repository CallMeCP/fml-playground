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
  x: number = 10;
  y: number = 10;
  width: number = 214;
  height: number = 63;
  weight: number = 100;
  bgColor: string = 'white';
  fontColor: string = 'black';  //  line color aka signature colour
  signatureId: string = 'NEW_APP_SIG_ID';

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
      signatureId: this.signatureId
    };

    this.propertyService.viewToProperty$.emit(fmlSignature);
  }

  onWindowPress(event: MouseEvent) {
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
            this.componentType = properties.componentType;
            this.x = properties.x;
            this.y = properties.y;
            this.width = properties.width;
            this.height = properties.height;
            this.weight = properties.weight;
            this.bgColor = properties.bgColor;
            this.fontColor = properties.fontColor;
            this.signatureId = properties.signatureId;
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

}
