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
  fmlBodyProp: FmlBody[] = [];
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
    let splitStr: string[] = fmlBody.componentId.split("_");

    // e.g. "PAGE_1"
    const index = parseInt(splitStr[1]);
    this.fmlBodyProp[index-1] = fmlBody;
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
    // Return if no body
    if (this.fmlBodyProp.length <= 0) {
      return;
    }

    // Create global references to Body container x and y
    const pageX: number = this.fmlBodyProp[0].x;
    const pageY: number = this.fmlBodyProp[0].y;
    const page: FmlBody = this.fmlBodyProp[0];
    const PP: number = 0.75;          // convert point? pixel?


    // Final FML script
    let finalFmlStr: string = ``;

    // Construct Start of body tag
    finalFmlStr += `<fml>\n\t<body width=${page.width*PP} height=${page.height*PP} bgcolor=${page.bgColor} font=${page.fontFamily} \n\t\tsize=${page.fontSize*PP} color=${page.fontColor}>\n`;

    for (let index = 0; index < this.fmlBodyProp.length; index++) {
      // Construct page tag
      if (index !== 0) {
        finalFmlStr += `\n\t\t<!-- Page ${index+1} -->\n\t\t<page>\n`;
      }else if (index == 0) {
        finalFmlStr += `\n\t\t<!-- Page 1 -->\n`;
      }

      // Reference to Page Size, so that only create element that fall within the page size.
      const pgYMin: number = this.fmlBodyProp[index].y;
      const pgYMax: number = this.fmlBodyProp[index].y + this.fmlBodyProp[index].height;
      const bodyX: number = this.fmlBodyProp[index].x;
      const bodyY: number = this.fmlBodyProp[index].y;

      // Construct Signatures
      let addedSigComment: boolean = false;
      this.fmlSignatureProp.map(sig => {
        if (!sig.deleted && (sig.y >= pgYMin) && (sig.y+sig.height <= pgYMax) ) {

          if (!addedSigComment) {
            finalFmlStr += `\t\t<!-- Signatures -->\n`;
            addedSigComment = true;
          }

          const str:string =
            `\t\t<signature x=${(sig.x-bodyX)*0.75} y=${(sig.y-bodyY)*0.75} width=${sig.width*0.75} height=${sig.height*0.75} 
              \t\twt=${sig.weight*PP} bgcolor=${sig.bgColor} color=${sig.fontColor} id=${sig.signatureId}>\n\n`;
  
          finalFmlStr += str;
        }
      });

      // Construct Labels
      let addedLblComment: boolean = false;
      this.fmlLabelProp.map(lbl => {
        if (!lbl.deleted && (lbl.y >= pgYMin) && (lbl.y + lbl.height <= pgYMax)) {

          if (!addedLblComment) {
            finalFmlStr += `\t\t<!-- Labels -->\n`;
            addedLblComment = true;
          }

          const str: string =
            `\t\t<t x=${(lbl.x-bodyX)*PP} y=${(lbl.y-bodyY)*PP} w=${lbl.width*PP} h=${lbl.height*PP} bgcol=${lbl.bgColor} col=${lbl.fontColor} 
                \tfont=${lbl.fontFamily} sz=${lbl.fontSize*PP}>
              \t\t${lbl.bold?'<bo>': ''}${lbl.italic?'<i>':''}${lbl.content}${lbl.italic?'</i>': ''}${lbl.bold?'</bo>':''}
            \t</t>\n\n`;

          finalFmlStr += str;
        }
      });

      // Construct Textfield
      let addedTxtComment: boolean = false;
      this.fmlTextfieldProp.map(txt => {
        if (!txt.deleted && (txt.y >= pgYMin) && (txt.y+txt.height <= pgYMax)) {
          const BS: number = txt.borderSize;

          if (!addedTxtComment) {
            finalFmlStr += `\t\t<!-- Textfields -->\n`;
            addedTxtComment = true;
          }

          const str: string =
            `\t\t<t x=${(txt.x-bodyX-BS)*PP} y=${(txt.y-bodyY-BS)*PP} w=${(txt.width+BS*2)*PP} h=${(txt.height+BS*2)*PP} bgcol=BLACK font=${txt.fontFamily} sz=${txt.fontSize*PP}>
                \t<t x=${BS*PP} y=${BS*PP} w=${txt.width*PP} h=${txt.height*PP} bgcol=${txt.bgColor} col=${txt.fontColor}>
                  \t\t<t w=${txt.width*PP} y=${(txt.height/2)*PP} valign=CENTER>
                    \t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=${txt.symbolId?`${txt.symbolId}`:`PF.${txt.pfId}`} conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}
                  \t\t</t>
                \t</t>
            \t</t>\n\n`;

            finalFmlStr += str;
        }
      });

      // Construct Checkbox
      let addedChkComment: boolean = false;
      this.fmlCheckboxProp.map(chk => {
        if (!chk.deleted && (chk.y >= pgYMin) && (chk.y+chk.height <= pgYMax)) {
          const BS: number = chk.borderSize;

          if (!addedChkComment) {
            finalFmlStr += `\t\t<!-- Checkboxes -->\n`;
            addedChkComment = true;
          }

          const str: string =
            `\t\t<t x=${(chk.x-bodyX-BS)*PP} y=${(chk.y-bodyY-BS)*PP} w=${(chk.width+BS*2)*PP} h=${(chk.height+BS*2)*PP} bgcol=BLACK sz=${chk.fontSize*PP}>
                \t<t x=${BS*PP} y=${BS*PP} w=${chk.width*PP} h=${chk.height*PP} bgcol=${chk.bgColor} col=${chk.fontColor}>
                  \t\t<t w=${chk.width*PP} x=${(chk.width/2)*PP} y=${(chk.height/2)*PP} valign=CENTER align=CENTER>
                    \t\t\t<if>${chk.symbolId?`${chk.symbolId}`: ''}${chk.pfId?`PF.${chk.pfId}`: ''}${chk.varId?`${chk.varId}`: ''}${chk.comparison}${chk.varId?'':'"'}${chk.compareTo}${chk.varId?'':'"'}<then>✔</if>
                  \t\t</t>
                \t</t>
            \t</t>\n\n`;

          finalFmlStr += str;
        }
      });

      // Construct Button
      let addedBtnComment: boolean = false;
      this.fmlButtonProp.map(btn => {
        if (!btn.deleted && (btn.y >= pgYMin) && (btn.y+btn.height <= pgYMax)) {
          
          if (!addedBtnComment) {
            finalFmlStr += `\t\t<!-- Buttons -->\n`;
            addedBtnComment = true;
          }
          
          const str: string = 
          `\t\t<button x=${(btn.x-bodyX)*PP} y=${(btn.y-bodyY)*PP} w=${btn.width*PP} h=${btn.height*PP} id=${btn.buttonId}>
            \t\t${btn.content}
          \t</button>\n\n`;

          finalFmlStr += str;
        }
      });
      
    }

    // Construct End of Body Tag
    finalFmlStr += `\t</body>\n</fml>`;

    return finalFmlStr;
    
  }
}
