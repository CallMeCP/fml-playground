import { Injectable, EventEmitter } from '@angular/core';
import { FmlBody } from '../interfaces/FmlBody.interface';
import { FmlSignature } from '../interfaces/FmlSignature.interface';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  //  Sync HTML component changes to Property Panel
  viewToProperty$: EventEmitter<any> = new EventEmitter();
  
  // Sync Property Panel changes to HTML component
  propertyToView$: EventEmitter<any> = new EventEmitter();

  // Final FML Components Property
  fmlBodyProp: FmlBody;
  fmlSignatureProp: FmlSignature[] = [];

  constructor(
    private dialog: MatDialog
  ) { }

  updateFmlBody(fmlBody: FmlBody) {
    this.fmlBodyProp = fmlBody;
  }

  updateFmlSignature(fmlSig: FmlSignature) {
    let splitStr: string[] = fmlSig.componentId.split("_");

    // e.g. "SIGNATURE_1"
    const index = parseInt(splitStr[1]);
    this.fmlSignatureProp[index-1] = fmlSig;
  }

  genFml() {
    // Create references to Body container x and y
    const bodyX: number = this.fmlBodyProp.x;
    const bodyY: number = this.fmlBodyProp.y;
    const body: FmlBody = this.fmlBodyProp;

    // Construct Signatures
    let sigStr: string = ``;

    this.fmlSignatureProp.map(sig => {
      const str:string =
        `<signature x=${(sig.x-bodyX)*0.75} y=${(sig.y-bodyY)*0.75} width=${sig.width*0.75} height=${sig.height*0.75} 
          weight=${sig.weight} bgcolor=${sig.bgColor} color=${sig.fontColor} id=${sig.signatureId}>
      `;

      sigStr += str;
    });

    // Construct body
    const bodyStr: string =
      `
<fml>
  <body width=${body.width*0.75} height=${body.height*0.75} bgcolor=${body.bgColor} font=${body.fontFamily} 
    size=${body.fontSize} color=${body.fontColor}>
    ${sigStr}
  </body>
</fml>`; 

    // console.log(bodyStr);
    return bodyStr;
    
  }
}
