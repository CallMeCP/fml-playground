import { Injectable, EventEmitter } from '@angular/core';
import { FmlBody } from '../interfaces/FmlBody.interface';
import { FmlSignature } from '../interfaces/FmlSignature.interface';
import { MatDialog } from '@angular/material';
import { FmlLabel } from '../label/label.interface';
import { FmlButton } from '../interfaces/FmlButton.interface';
import { FmlTextField } from '../textfield/textfield.interface';
import { FmlCheckbox } from '../checkbox/checkbox.interface';

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
  fmlLabelProp: FmlLabel[] = [];
  fmlButtonProp: FmlButton[] = [];
  fmlTextfieldProp: FmlTextField[] = [];
  fmlCheckboxProp: FmlCheckbox[] = [];

  constructor(
    private dialog: MatDialog
  ) { }

  // Some of the colour name use in FML is differnt from what we found on internet CSS colour
  getColourString(colour: string): string {
    let rgbStr: string = '';

    switch (colour) {
      case 'black':
        rgbStr = 'rgb(0,     0,      0)';    
        break;
      case 'brown':
        rgbStr = 'rgb(153,   51,     0)';    
        break;
      case 'red':
        rgbStr = 'rgb(255,   0,      0)';    
        break;
      case 'orange':
        rgbStr = 'rgb(255,   153,    0)';    
        break;
      case 'yellow':
        rgbStr = 'rgb(255,   255,    0)';    
        break;
      case 'green':
        rgbStr = 'rgb(0,     255,    0)';    
        break;
      case 'blue':
        rgbStr = 'rgb(0,     0,      255)';    
        break;
      case 'violet':
        rgbStr = 'rgb(255,   0,      255)';    
        break;
      case 'grey':
        rgbStr = 'rgb(150,   150,    150)';    
        break;
      case 'white':
        rgbStr = 'rgb(255,   255,    255)';    
        break;
      // case 'transparent':
      //   rgbStr = 'rgb(0,     0,      0,      255)';    
      //   break;
    
      default:
        break;
    }

    return rgbStr;
  }

  updateFmlBody(fmlBody: FmlBody) {
    this.fmlBodyProp = fmlBody;
  }

  updateFmlSignature(fmlSig: FmlSignature) {
    let splitStr: string[] = fmlSig.componentId.split("_");

    // e.g. "SIGNATURE_1"
    const index = parseInt(splitStr[1]);
    this.fmlSignatureProp[index-1] = fmlSig;
  }

  updateFmlLabel(fmlLbl: FmlLabel) {
    let splitStr: string[] = fmlLbl.componentId.split("_");

    // e.g. "LABEL_1"
    const index = parseInt(splitStr[1]);
    this.fmlLabelProp[index-1] = fmlLbl;
  }

  updateFmlButton(fmlBtn: FmlButton) {
    let splitStr: string[] = fmlBtn.componentId.split("_");

    // e.g. "BUTTON_1"
    const index = parseInt(splitStr[1]);
    this.fmlButtonProp[index-1] = fmlBtn;

  }

  updateFmlTextfield(fmlTxt: FmlTextField) {
    let splitStr: string[] = fmlTxt.componentId.split("_");

    // e.g. "TEXTFIELD_1"
    const index = parseInt(splitStr[1]);
    this.fmlTextfieldProp[index-1] = fmlTxt;

  }

  updateFmlCheckbox(fmlChk: FmlCheckbox) {
    let splitStr: string[] = fmlChk.componentId.split("_");

    // e.g. "TEXTFIELD_1"
    const index = parseInt(splitStr[1]);
    this.fmlCheckboxProp[index-1] = fmlChk;
  }

  genFml() {
    // Create references to Body container x and y
    const bodyX: number = this.fmlBodyProp.x;
    const bodyY: number = this.fmlBodyProp.y;
    const body: FmlBody = this.fmlBodyProp;
    const PP: number = 0.75;          // convert point? pixel?

    // Construct Signatures
    let sigStr: string = ``;

    this.fmlSignatureProp.map(sig => {
      if (!sig.deleted) {
        const str:string =
          `<signature x=${(sig.x-bodyX)*0.75} y=${(sig.y-bodyY)*0.75} width=${sig.width*0.75} height=${sig.height*0.75} 
            weight=${sig.weight} bgcolor=${sig.bgColor} color=${sig.fontColor} id=${sig.signatureId}>\n\t`;

        sigStr += str;
      }
    });

    // Construct Label
    let lblStr: string = ``;

    this.fmlLabelProp.map(lbl => {
      if (!lbl.deleted) {
        const str: string =
          `<t x=${(lbl.x-bodyX)*PP} y=${(lbl.y-bodyY)*PP} w=${lbl.width*PP} h=${lbl.height*PP} bgcol=${lbl.bgColor} col=${lbl.fontColor} 
              font=${lbl.fontFamily} sz=${lbl.fontSize*PP}>
            ${lbl.bold?'<bo>': ''}${lbl.italic?'<i>':''}${lbl.content}${lbl.italic?'</i>': ''}${lbl.bold?'</bo>':''}
          </t>\n\t`;

        lblStr += str;
      }
    });

    // Construct Textfield
    let txStr: string = ``;

    this.fmlTextfieldProp.map(txt => {
      if (!txt.deleted) {
        const BS: number = txt.borderSize;

        const str: string =
          `<t x=${(txt.x-bodyX-BS)*PP} y=${(txt.y-bodyY-BS)*PP} w=${(txt.width+BS*2)*PP} h=${(txt.height+BS*2)*PP} bgcol=BLACK 
              font=${txt.fontFamily} sz=${txt.fontSize*PP}>
              <t x=${BS*PP} y=${BS*PP} w=${txt.width*PP} h=${txt.height*PP} bgcol=${txt.bgColor} col=${txt.fontColor}>
                <t w=${txt.width*PP} y=${(txt.height/2)*PP} valign=CENTER>
                  ${txt.bold?'<bo>': ''}${txt.italic?'<i>':''} <ins sym=${txt.symbolId} conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}
                </t>
              </t>
          </t>\n\t`;

        lblStr += str;
      }
    });

    // Construct Checkbox
    let chkStr: string = ``;

    this.fmlCheckboxProp.map(chk => {
      if (!chk.deleted) {
        const BS: number = chk.borderSize;

        const str: string =
          `<t x=${(chk.x-bodyX-BS)*PP} y=${(chk.y-bodyY-BS)*PP} w=${(chk.width+BS*2)*PP} h=${(chk.height+BS*2)*PP} bgcol=BLACK sz=${chk.fontSize*PP}>
              <t x=${BS*PP} y=${BS*PP} w=${chk.width*PP} h=${chk.height*PP} bgcol=${chk.bgColor} col=${chk.fontColor}>
                <t w=${chk.width*PP} x=${(chk.width/2)*PP} y=${(chk.height/2)*PP} valign=CENTER align=CENTER>
                  <if>${chk.symbolId?`${chk.symbolId}`: ''}${chk.pfId?`PF.${chk.pfId}`: ''}${chk.varId?`${chk.varId}`: ''}${chk.comparison}${chk.varId?'':'"'}${chk.compareTo}${chk.varId?'':'"'}<then>✔</if>
                </t>
              </t>
          </t>\n\t`;

        chkStr += str;
      }
    });

    // Construct Button
    let btnStr: string = ``;

    this.fmlButtonProp.map(btn => {
      if (!btn.deleted) {
        const str: string = 
        `<button x=${(btn.x-bodyX)*PP} y=${(btn.y-bodyY)*PP} w=${btn.width*PP} h=${btn.height*PP} id=${btn.buttonId}>
          ${btn.content}
        </button>\n\t`;

        btnStr += str;
      }
    });

    // Construct body
    const bodyStr: string =
      `
<fml>
  <body width=${body.width*0.75} height=${body.height*0.75} bgcolor=${body.bgColor} font=${body.fontFamily} 
    size=${body.fontSize} color=${body.fontColor}>
    ${sigStr}
    ${lblStr}
    ${btnStr}
    ${chkStr}
  </body>
</fml>`; 

    return bodyStr;
    
  }
}
