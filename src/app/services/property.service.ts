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
  // Duplicate from AppComponent, re-vamp when free
  symbolIds: string[] = [
    'REAL_DATE', 'REAL_TIME', 'REAL_DATE_TIME', 'CUST_DATE', 'USER_ID', 'USER_NAME', 'CUST_ID',
    'CUST_NAME', 'CUST_TITLE', 'VINYL_TYPE', 'CUST_TYPE', 'NAS_NAME', 'NAS_TITLE', 'NAS_LANG',
    'OPCN_NAME[0]', 'OPCN_NAME[1]', 'OPCN_NAME[2]', 'OPCN_NAME[3]', 'OPCN_NAME[4]', 'OPCN_NAME[5]', 
    'OPCN_TITLE[0]', 'OPCN_TITLE[1]', 'OPCN_TITLE[2]', 'OPCN_TITLE[3]', 'OPCN_TITLE[4]', 'OPCN_TITLE[5]', 
    'OPCN_LANG[0]', 'OPCN_LANG[1]', 'OPCN_LANG[2]', 'OPCN_LANG[3]', 'OPCN_LANG[4]', 'OPCN_LANG[5]', 
    'OPCN_TYPE[0]', 'OPCN_TYPE[1]', 'OPCN_TYPE[2]', 'OPCN_TYPE[3]', 'OPCN_TYPE[4]', 'OPCN_TYPE[5]',  
    'ID_DOC_NO[0]', 'ID_DOC_NO[1]', 'ID_DOC_NO[2]', 'ID_DOC_NO[3]', 
    'ID_TYPE[0]', 'ID_TYPE[1]', 'ID_TYPE[2]', 'ID_TYPE[3]', 
    'ID_ISS_AUTH[0]', 'ID_ISS_AUTH[1]', 'ID_ISS_AUTH[2]', 'ID_ISS_AUTH[3]', 
    'ID_ISS_DATE[0]', 'ID_ISS_DATE[1]', 'ID_ISS_DATE[2]', 'ID_ISS_DATE[3]', 
    'ID_EXP_DATE[0]', 'ID_EXP_DATE[1]', 'ID_EXP_DATE[2]', 'ID_EXP_DATE[3]', 
    'NATIONALITY', 'SPONSOR_ID', 'SPONSOR_TITLE', 'SPONSOR_NAME', 'CUST_DOB', 'GENDER', 'PREF_LANG', 'PF.PCM',
    'EMAIL', 'EMAIL_STATUS', 
    'TEL_DESC[0]', 'TEL_DESC[1]', 'TEL_DESC[2]', 'TEL_DESC[3]', 'TEL_DESC[4]', 'TEL_DESC[5]', 
    'TEL_NO[0]', 'TEL_NO[1]', 'TEL_NO[2]', 'TEL_NO[3]', 'TEL_NO[4]', 'TEL_NO[5]', 
    'SMS_STATUS', 'VOICE_STATUS',
    'AD_STATUS', 
    'AD_DESC[0]', 'AD_DESC[1]', 'AD_DESC[2]', 'AD_DESC[3]', 
    'AD_1[0]', 'AD_1[1]', 'AD_1[2]', 'AD_1[3]',
    'AD_2[0]', 'AD_2[1]', 'AD_2[2]', 'AD_2[3]', 
    'AD_3[0]', 'AD_3[1]', 'AD_3[2]', 'AD_3[3]', 
    'AD_CITY[0]', 'AD_CITY[1]', 'AD_CITY[2]', 'AD_CITY[3]',
    'AD_STATE[0]', 'AD_STATE[1]', 'AD_STATE[2]', 'AD_STATE[3]', 
    'AD_COUNTRY[0]', 'AD_COUNTRY[1]', 'AD_COUNTRY[2]', 'AD_COUNTRY[3]', 
    'AD_POSTCODE[0]', 'AD_POSTCODE[1]', 'AD_POSTCODE[2]', 'AD_POSTCODE[3]',
    'AD_LANG[0]', 'AD_LANG[1]', 'AD_LANG[2]', 'AD_LANG[3]',
    'REC_USER_ID', 'REC_NAME', 'APP_USER_ID',
    'APP_NAME', 'PEP_DESIG', 'PEP_YEAR_APPTD', 'PEP_TENURE_VAL', 'PEP_TENURE_UNITS',   
  ];

  variables: string[] = [
    'ID_PRI_ID_FLAG[0]', 'ID_PRI_ID_FLAG[1]', 'ID_PRI_ID_FLAG[2]', 'ID_PRI_ID_FLAG[3]',
    'TEL_SMS[0]', 'TEL_SMS[1]', 'TEL_SMS[2]', 'TEL_SMS[3]', 'TEL_SMS[4]', 'TEL_SMS[5]', 
    'TEL_VOICE[0]', 'TEL_VOICE[1]', 'TEL_VOICE[2]', 'TEL_VOICE[3]', 'TEL_VOICE[4]', 'TEL_VOICE[5]', 
    'AD_REGION_ID[0]', 'AD_REGION_ID[1]', 'AD_REGION_ID[2]', 'AD_REGION_ID[3]', 
    'AD_INTL_MAIL[0]', 'AD_INTL_MAIL[1]', 'AD_INTL_MAIL[2]', 'AD_INTL_MAIL[3]', 
    'AD_DOM_MAIL[0]', 'AD_DOM_MAIL[1]', 'AD_DOM_MAIL[2]', 'AD_DOM_MAIL[3]', 
  ];

  //  Sync HTML component changes to Property Panel
  viewToProperty$: EventEmitter<any> = new EventEmitter();
  
  // Sync Property Panel changes to HTML component
  propertyToView$: EventEmitter<any> = new EventEmitter();

  // Notify subscriber to load components
  isLoadFml$: EventEmitter<boolean> = new EventEmitter();

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

  loadFml(fmlScript: string) {

    const remTab = fmlScript.replace(/\n\s+/g, '');
    const tokens = remTab.split('<').map(el => el.split('>')).reduce((acc, curr) => acc.concat(curr))

    const PP: number = 0.75;

    let btnId: number = 0;
    let btn: any = {};
    let lblId: number = 0;
    let lbl: any = {};
    let sigId: number = 0;
    let sig: any = {};
    let txtId: number = 0;
    let txt: any = {};
    let chkId: number = 0;
    let chk: any = {};

    let currentType = '';

    console.log(tokens);

    for (let index = 0; index < tokens.length; index++) {
      // Row
      const el: string = tokens[index];

      if (el.indexOf('Checkboxes') !== -1) {
        currentType = 'Checkboxes';
      }
      
      // Construct BUTTON
      if (el.indexOf('button') !== -1 && el.indexOf('id=') !== -1) {

        // Get Button Properties
        const el2 = el.split(' ');

        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { btn.x = ((+str[1]) / PP + 10);}
          if (el.indexOf('y=') !== -1) { btn.y = (+str[1]) / PP + 10; }
          if (el.indexOf('w=') !== -1) { btn.width = +str[1] / PP; }
          if (el.indexOf('h=') !== -1) { btn.height = +str[1] / PP; }
          if (el.indexOf('id=') !== -1) { btn.buttonId = str[1]; }
          if (el.indexOf('id=') !== -1) {btn.componentType = 'Button'; }
          if (el.indexOf('id=') !== -1) {btn.componentId = `BUTTON_${++btnId}`};
            
        });

        btn.content = tokens[index+1];

        this.fmlButtonProp.push({
          componentId: btn.componentId,
          buttonId: btn.buttonId,
          componentType: btn.componentType,
          content: btn.content,
          deleted: false,
          height: btn.height,
          width: btn.width,
          x: btn.x,
          y: btn.y
        });
      }

      // Construct LABEL
      if (el.indexOf('t') !== -1 && el.indexOf('x=') !== -1 && el.indexOf('y=') !== -1 && el.indexOf('font=') !== -1 
          && tokens[index+2].indexOf('x=') == -1 && tokens[index+2].indexOf('y=') == -1) {
        
        // Get Label Properties
        const el2 = el.split(' ');

        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { lbl.x = ((+str[1]) / PP + 10);}
          if (el.indexOf('y=') !== -1) { lbl.y = (+str[1]) / PP + 10; }
          if (el.indexOf('w=') !== -1) { lbl.width = +str[1] / PP; }
          if (el.indexOf('h=') !== -1) { lbl.height = +str[1] / PP; }
          if (el.indexOf('bgcol=') !== -1) { lbl.bgColor = str[1]; }
          if (el.indexOf('col=') !== -1) { lbl.fontColor = str[1]; }
          if (el.indexOf('font=') !== -1) { lbl.fontFamily = str[1]; }
          if (el.indexOf('sz=') !== -1) { lbl.fontSize = +str[1] / PP; }
        });

        lbl.componentType = 'Label';
        lbl.componentId = `LABEL_${++lblId}`;
        lbl.deleted = false;

    
        if (tokens[index+2] === 'bo' && tokens[index+4] === 'i') {
          lbl.bold = true;
          lbl.italic = true;
          lbl.content = tokens[index+5];

        }else if (tokens[index+2] === 'bo') {
          lbl.bold = true;
          lbl.italic = false;
          lbl.content = tokens[index+3];          

        }else if (tokens[index+2] === 'i'){
          lbl.bold = false;
          lbl.italic = true;
          lbl.content = tokens[index+3];

        }else {
          lbl.bold = false;
          lbl.italic = false;
          lbl.content = tokens[index+1];
        }

        this.fmlLabelProp.push({
          componentId: lbl.componentId,
          componentType: lbl.componentType,
          content: lbl.content,
          deleted: false,
          height: lbl.height,
          width: lbl.width,
          x: lbl.x,
          y: lbl.y,
          bold: lbl.bold,
          italic: lbl.italic,
          bgColor: lbl.bgColor,
          fontColor: lbl.fontColor,
          fontFamily: lbl.fontFamily,
          fontSize: lbl.fontSize
        });
      }

      // Construct SIGNATURE
      if (el.indexOf('signature') !== -1 && el.indexOf('id=') !== -1) {

        // // Get Signature Properties
        const el2 = el.split(' ');

        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { sig.x = ((+str[1]) / PP + 10);}
          if (el.indexOf('y=') !== -1) { sig.y = (+str[1]) / PP + 10; }
          if (el.indexOf('width=') !== -1) { sig.width = +str[1] / PP; }
          if (el.indexOf('height=') !== -1) { sig.height = +str[1] / PP; }
          if (el.indexOf('wt=') !== -1) { sig.weight = +str[1] / PP; }
          if (el.indexOf('bgcolor=') !== -1) { sig.bgColor = str[1]; } 
          if (el.indexOf('color=') !== -1) { sig.fontColor = str[1]; }
          if (el.indexOf('id=') !== -1) { sig.signatureId = str[1]; }
        });

        sig.componentType = 'Signature';
        sig.componentId = `SIGNATURE_${++sigId}`;
        sig.deleted = false;

        this.fmlSignatureProp.push({
          componentId: sig.componentId,
          signatureId: sig.signatureId,
          componentType: sig.componentType,
          deleted: false,
          height: sig.height,
          width: sig.width,
          x: sig.x,
          y: sig.y,
          weight: sig.weight,
          bgColor: sig.bgColor,
          fontColor: sig.fontColor
        });
      }

      // Construct Textfield
      if (el.indexOf('t') !== -1 && el.indexOf('x=') !== -1 && el.indexOf('y=') !== -1 && el.indexOf('font=') !== -1 
          && tokens[index+2].indexOf('x=') !== -1 && tokens[index+2].indexOf('y=') !== -1 ) {
        
        // LINE 2 - Get border size, bgcolor, color
        const line2Tokens = tokens[index+2].split(' ');
        line2Tokens.map(res => {
          const tok = res.split('=');

          if (res.indexOf('x=') !== -1) { txt.borderSize = +tok[1] / PP }
          if (res.indexOf('bgcol=') !== -1) { txt.bgcol = tok[1] }
          if (res.indexOf('col=') !== -1) { txt.col = tok[1] }
        });

        // LINE 1 - Get Textfield x, y, w, h, font family, and size
        const line1Tokens = el.split(' ');
        line1Tokens.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { txt.x = (((+str[1]) + txt.borderSize*0.75) / PP + 10);}
          if (el.indexOf('y=') !== -1) { txt.y = ((+str[1]) + txt.borderSize*0.75) / PP + 10; }
          if (el.indexOf('w=') !== -1) { txt.width = ((+str[1]) - txt.borderSize*2*0.75)  / PP; }
          if (el.indexOf('h=') !== -1) { txt.height = ((+str[1] - txt.borderSize*2*0.75)) / PP; }
          if (el.indexOf('font=') !== -1) { txt.fontFamily = str[1]; }
          if (el.indexOf('sz=') !== -1) { txt.fontSize = +str[1] / PP; }
        });

        txt.componentType = 'Textfield';
        txt.componentId = `TEXTFIELD_${++txtId}`;
        txt.deleted = false;

        // Get bold, italic, index of symbol position
        if (tokens[index+6] === 'bo' && tokens[index+8] === 'i') {
          txt.bold = true;
          txt.italic = true;
          txt.symPos = 10;

        }else if (tokens[index+6] === 'bo') {
          txt.bold = true;
          txt.italic = false;
          txt.symPos = 8;     

        }else if (tokens[index+6] === 'i'){
          txt.bold = false;
          txt.italic = true;
          txt.symPos = 8;

        }else {
          txt.bold = false;
          txt.italic = false;
          txt.symPos = 6;
        }

        // LINE 4 - Get symbol, pref, conv
        const line4Tokens = tokens[index+txt.symPos].split(' ');
        line4Tokens.map (res => {
          const tok = res.split('=');

          if (res.indexOf('sym=') !== -1) { 
            txt.symbolId = tok[1];
            txt.pfId = '';
            
            if (txt.symbolId.indexOf('PF.') !== -1) {
              txt.symbolId = '';

              const prefTok = tok[1].split('.');
              txt.pfId = prefTok[1];
            }
          }
          if (res.indexOf('conv=') !== -1) { txt.conv = tok[1]; }
        });

        this.fmlTextfieldProp.push({
          componentId: txt.componentId,
          componentType: txt.componentType,
          content: '',
          deleted: false,
          height: txt.height,
          width: txt.width,
          x: txt.x,
          y: txt.y,
          bold: txt.bold,
          italic: txt.italic,
          bgColor: txt.bgcol,
          fontColor: txt.col,
          fontFamily: txt.fontFamily,
          fontSize: txt.fontSize,
          symbolId: txt.symbolId,
          pfId: txt.pfId,
          textConv: txt.conv,
          borderSize: txt.borderSize
        });
      }

      // Construct Checkbox
      if (el.indexOf('t') !== -1 && el.indexOf('x=') !== -1 && el.indexOf('y=') !== -1 
          && tokens[index+2].indexOf('x=') !== -1 && tokens[index+2].indexOf('y=') !== -1 
          && tokens[index+6].indexOf('if') !== -1
          && currentType === 'Checkboxes') {
        
        // LINE 2 - Get border size, bgcolor, color
        const line2Tokens = tokens[index+2].split(' ');
        line2Tokens.map(res => {
          const tok = res.split('=');

          if (res.indexOf('x=') !== -1) { chk.borderSize = +tok[1] / PP }
          if (res.indexOf('bgcol=') !== -1) { chk.bgcol = tok[1] }
          if (res.indexOf('col=') !== -1) { chk.col = tok[1] }
        });

        // LINE 1 - Get Textfield x, y, w, h, and size
        const line1Tokens = el.split(' ');
        line1Tokens.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { chk.x = (((+str[1]) + chk.borderSize*0.75) / PP + 10);}
          if (el.indexOf('y=') !== -1) { chk.y = ((+str[1]) + chk.borderSize*0.75) / PP + 10; }
          if (el.indexOf('w=') !== -1) { chk.width = ((+str[1]) - chk.borderSize*2*0.75)  / PP; }
          if (el.indexOf('h=') !== -1) { chk.height = ((+str[1] - chk.borderSize*2*0.75)) / PP; }
          if (el.indexOf('sz=') !== -1) { chk.fontSize = +str[1] / PP; }
        });

        chk.componentType = 'Checkbox';
        chk.componentId = `CHECKBOX_${++chkId}`;
        chk.deleted = false;
        
        // Check is Symbol, Variable, or Pref Id
        let isSymbol = this.symbolIds.includes(tokens[index+7]);
        let isVar = this.variables.includes(tokens[index+7]);

        if (isSymbol) {
          chk.symbolId = tokens[index+7];
          chk.pfId = '';
          chk.varId = '';
        }else if (isVar) {
          chk.symbolId = '';
          chk.pfId = '';
          chk.varId = tokens[index+7];
        }else {
          chk.symbolId = '';
          chk.pfId = tokens[index+7];
          chk.varId = '';
        }

        // Set Comparison
        chk.comparison = tokens[index+8];

        // Set CompareTo
        if (isVar) {
          chk.compareTo = tokens[index+9];  
        }else {
          const compTok = tokens[index+9].split('"');
          chk.compareTo = compTok[1];
        }

        this.fmlCheckboxProp.push({
          componentId: chk.componentId,
          componentType: chk.componentType,
          deleted: false,
          height: chk.height,
          width: chk.width,
          x: chk.x,
          y: chk.y,
          bgColor: chk.bgcol,
          fontColor: chk.col,
          fontSize: chk.fontSize,
          symbolId: chk.symbolId,
          pfId: chk.pfId,
          varId: chk.varId,
          compareTo: chk.compareTo,
          comparison: chk.comparison,
          borderSize: chk.borderSize
        });
      }
    }
  
    // console.log(this.fmlCheckboxProp);

    // Notify subscriber
    this.isLoadFml$.next(true);
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
