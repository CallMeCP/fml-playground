import { Injectable, EventEmitter } from '@angular/core';
import { FmlBody } from '../interfaces/FmlBody.interface';
import { FmlSignature } from '../interfaces/FmlSignature.interface';
import { MatDialog } from '@angular/material';
import { FmlLabel } from '../label/label.interface';
import { FmlButton } from '../interfaces/FmlButton.interface';
import { FmlTextField } from '../textfield/textfield.interface';
import { FmlCheckbox } from '../checkbox/checkbox.interface';

// TODO: 
// Revamp logic in genFml
// Revamp logic in loadFml
// Revamp symbolIds and variables (currently copied from AppComponent)

// MODULE INDEX
// NAME                   CONTENTS
// constructor            Empty
// getColourString        Return R.G.B string from colour name
// updateFmlBody          Update global FmlBody component properties
// updateFmlSignature     Update global FmlSignature properties
// updateFmlLabel         Update global FmlLabel properties
// updateFmlButton        Update global FmlButton properties
// updateFmlTextfield     Update global FmlTextfield properties
// updateFmlCheckbox      Update global FmlCheckbox properties
// updateCurrentPage      Update current working page, use to push new item to correct page
// getCompStartXY         Return where should a new component to place at XY position (currently it return center point)
// updatedPageProp        Sync properties of all pages, and do a UI refresh
// loadFml                Parse FmlScripts, create components, and do UI refresh
// genFml                 Generate FmlScripts, and return it
// toggleGrid             Update showGrid status, and do UI refresh
// updateGlobalFontSize   Set all components with same font size, and do UI refresh
// updateGlobalFontFamily Set all components with same font family, and do UI refresh

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  // Duplicate from AppComponent, re-vamp when free
  symbolIds: string[] = [
    'REAL_DATE', 'REAL_TIME', 'REAL_DATE_TIME', 'CUST_DATE', 'USER_ID', 'USER_NAME', 'CUST_ID',
    'CUST_NAME', 'CUST_TITLE', 'VINYL_TYPE', 'CUST_TYPE', 'NAS_NAME', 'NAS_TITLE', 'NAS_LANG',
    'OTHER_NAME', 'PREVIOUS_NAME',
    'OPCN_NAME[0]', 'OPCN_NAME[1]', 'OPCN_NAME[2]', 'OPCN_NAME[3]', 'OPCN_NAME[4]', 'OPCN_NAME[5]', 
    'OPCN_TITLE[0]', 'OPCN_TITLE[1]', 'OPCN_TITLE[2]', 'OPCN_TITLE[3]', 'OPCN_TITLE[4]', 'OPCN_TITLE[5]', 
    'OPCN_LANG[0]', 'OPCN_LANG[1]', 'OPCN_LANG[2]', 'OPCN_LANG[3]', 'OPCN_LANG[4]', 'OPCN_LANG[5]', 
    'OPCN_TYPE[0]', 'OPCN_TYPE[1]', 'OPCN_TYPE[2]', 'OPCN_TYPE[3]', 'OPCN_TYPE[4]', 'OPCN_TYPE[5]',
    'IC', 'PASSPORT', // Special purpose symbol
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
    'MAN_ADDRESS', 'MAN_CITY', 'MAN_STATE', 'MAN_POSTCODE', 'MAN_COUNTRY',  // Special purpose symbols
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

  // Current active component ID
  activeComponentId: string = 'NONE';

  // Current page selected
  currentWorkingPage: number = 1;

  // Settings
  showGrid: boolean = true;

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

  updateCurrentPage(page: number) {
    this.currentWorkingPage = page;
  }

  getCompStartXY() {
    // return ((this.currentWorkingPage-1)*this.fmlBodyProp[0].height)+(10*(this.currentWorkingPage));

    // Return Center coordinate of a page
    const xPos:number = (this.fmlBodyProp[0].width/2)+10;
    const yPos: number = ((this.currentWorkingPage)*this.fmlBodyProp[0].height)+(10*(this.currentWorkingPage))-this.fmlBodyProp[0].height/2;

    return {x: xPos, y: yPos};
  }

  updatedPageProp() {
    // const pageArrTemps: FmlBody[] = this.fmlBodyProp.slice();
    // this.fmlBodyProp = [];
    
    // for (let index = 0; index < pageArrTemps.length; index++) {
    //   this.fmlBodyProp.push({
    //     componentId: `PAGE_${index+1}`,
    //     componentType: 'Page',
    //     x: pageArrTemps[index].x,
    //     y: ((index)*pageArrTemps[0].height)+(10*(index+1)),
    //     width: pageArrTemps[index].width,
    //     height: pageArrTemps[index].height,
    //     bgColor: pageArrTemps[index].bgColor,
    //     fontColor: pageArrTemps[index].fontColor,
    //     fontSize: pageArrTemps[index].fontSize,
    //     fontFamily: pageArrTemps[index].fontFamily
    //   });
    // }

    for (let index = 1; index < this.fmlBodyProp.length; index++) {
      this.fmlBodyProp[index].bgColor = this.fmlBodyProp[0].bgColor;
      this.fmlBodyProp[index].fontColor = this.fmlBodyProp[0].fontColor;
      this.fmlBodyProp[index].fontFamily = this.fmlBodyProp[0].fontFamily;
      this.fmlBodyProp[index].fontSize = this.fmlBodyProp[0].fontSize;
      this.fmlBodyProp[index].height = this.fmlBodyProp[0].height;
      this.fmlBodyProp[index].width = this.fmlBodyProp[0].width;
      this.fmlBodyProp[index].x = this.fmlBodyProp[0].x;
      this.fmlBodyProp[index].y = ((index)*this.fmlBodyProp[0].height)+10*(index+1);
      this.fmlBodyProp[index].borderSize = this.fmlBodyProp[0].borderSize;
    }

    // Notify subscriber to refresh all components
    this.isLoadFml$.next(true);
  }

  loadFml(fmlScript: string) {

    if (fmlScript.length < 10) {
      return;
    }

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
    let pageId: number = 0;
    let page: any = {};
    let bodyId: number = 0;
    let body: any = {};

    let currentType = '';
    let currentPage: number = 1;
    let pgHgt: number = 0;         //  Page height to add on
    let borderAdded: boolean = false;

    // Reset to empty arrays
    this.fmlBodyProp = [];
    this.fmlButtonProp = [];
    this.fmlCheckboxProp = [];
    this.fmlLabelProp = [];
    this.fmlSignatureProp = [];
    this.fmlTextfieldProp = [];

    console.log(tokens);

    // Start parsing fml script row by row. TODO: revamp to be more flexible
    for (let index = 0; index < tokens.length; index++) {
      // Row
      const el: string = tokens[index];

      // Set current types. TODO - revamp when free
      if (el.indexOf('Checkboxes') !== -1) { currentType = 'CHECKBOX';}
      else if (el.indexOf('Signatures') !== -1) { currentType = 'SIGNATURE'; }
      else if (el.indexOf('Labels') !== -1) { currentType = 'LABEL'; }
      else if (el.indexOf('Textfields') !== -1) { currentType = 'TEXTFIELD'; }
      else if (el.indexOf('Buttons') !== -1) { currentType = 'BUTTON'; }
      else if (el.indexOf('PG_BORDER') !== -1) { currentType = 'PG_BORDER';}
      
      // Construct Body
      if (el.indexOf('body') !== -1) {
        // Get page properties
        const el2 = el.split(' ');
        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('width=') !== -1) { body.width = ((+str[1]) / PP);}
          if (el.indexOf('height=') !== -1) { body.height = (+str[1]) / PP; }
          if (el.indexOf('bgcolor=') !== -1) { body.bgColor = str[1]; }
          if (el.indexOf('font=') !== -1) { body.fontFamily = str[1]; }
          if (el.indexOf('size=') !== -1) { body.fontSize = +str[1] / PP; }
          if (el.indexOf('color=') !== -1) { body.fontColor = str[1]; }
        });
      }

      // Set current page, and construct Page
      if (el.indexOf('!-- Page') !== -1) {
        // Set current page
        const tok = el.split(' ');
        currentPage = +tok[2];

        // Calculate page height to add on on every components
        pgHgt = ((currentPage-1)*body.height)+(10*(currentPage-1));

        // Get Screen Activation Number, Page 1 and Page 2++ will have diff position
        let sanLine: any;
        if (pageId+1 == 1) {
          sanLine = tokens[index+3];
        }else {
          sanLine = tokens[index+5];
        }
         
        if (sanLine.indexOf('_SAN') !== -1) {
          body.screenActivationNumber = sanLine;
        }else {
          body.screenActivationNumber = 'NONE';
        }

        // Construct page
        this.fmlBodyProp.push({
          componentId: `PAGE_${++pageId}`,
          componentType: 'Page',
          x: 10,
          y: ((currentPage-1)*body.height)+10*currentPage,
          width: body.width,
          height: body.height,
          bgColor: body.bgColor,
          fontColor: body.fontColor,
          fontSize: body.fontSize,
          fontFamily: body.fontFamily,
          screenActivationNumber: body.screenActivationNumber,
          borderSize: 0 // **border size will be updated separately below
        });
      }

      // Construct Page Border for Page 1, **Assume user will only need consistent page border on every forms
      if (currentType === 'PG_BORDER' && borderAdded==false) { 
        // Next 2 line is the TOP border definition
        let topLine = tokens[index+2];
        let topLineToks = topLine.split(' ');
        topLineToks.map(tok => {
          let str = tok.split('=');
    
          if (tok.indexOf('h=') !== -1) {
            // for (let index = 0; index < this.fmlBodyProp.length; index++) {
              this.fmlBodyProp[0].borderSize = +str[1] / PP;
            // }

            borderAdded = true;
          };
        });
      }

      // Construct page border for subsequence pages, just copy from first page
      for (let index = 0; index < this.fmlBodyProp.length; index++) {
        if (this.fmlBodyProp[index].componentId !== 'PAGE_1') {
          this.fmlBodyProp[index].borderSize = this.fmlBodyProp[0].borderSize;
        }        
      }


      // Construct BUTTON
      if (currentType === 'BUTTON' && el.indexOf('button') !== -1 && el.indexOf('id=') !== -1) {

        // Get Button Properties
        const el2 = el.split(' ');

        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { btn.x = ((+str[1]) / PP + 10);}
          if (el.indexOf('y=') !== -1) { btn.y = ((+str[1]) / PP + 10) + pgHgt;}
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
      if (currentType === 'LABEL' && el.indexOf('t') !== -1 && el.indexOf('x=') !== -1 && el.indexOf('y=') !== -1 && el.indexOf('font=') !== -1 ) {
          // && tokens[index+2].indexOf('x=') == -1 && tokens[index+2].indexOf('y=') == -1) {
        
        // Get Label Properties
        const el2 = el.split(' ');

        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { lbl.x = ((+str[1]) / PP + 10);}
          if (el.indexOf('y=') !== -1) { lbl.y = ((+str[1]) / PP + 10) + pgHgt; }
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

        // Parse align, and valign
        const algmntToks = tokens[index+2].split(' ');
        algmntToks.map(el => {
          let str = el.split('=');
          
          // Convert horizontal align
          if (str[0] === 'align') { 
            switch (str[1]) {
              case 'left':
                lbl.horizontalAlign = 'left';
                break;
              case 'center':
                lbl.horizontalAlign = 'center';
                break;
              case 'right':
                lbl.horizontalAlign = 'right';
                break;
              default:
                lbl.horizontalAlign = 'left';
                break;
            }
          }

          if (str[0] === 'valign') { 
            switch (str[1]) {
              case 'top':
                lbl.verticalAlign = 'start';
                break;
              case 'center':
                lbl.verticalAlign = 'center';
                break;
              case 'bottom':
                lbl.verticalAlign = 'end';
                break;
              default:
                lbl.verticalAlign = 'start';
                break;
            }
          
          }
        });

        // Parse bold, italic, and content
        if (tokens[index+4] === 'bo' && tokens[index+6] === 'i') {
          lbl.bold = true;
          lbl.italic = true;
          lbl.content = tokens[index+7];

        }else if (tokens[index+4] === 'bo') {
          lbl.bold = true;
          lbl.italic = false;
          lbl.content = tokens[index+5];          

        }else if (tokens[index+4] === 'i'){
          lbl.bold = false;
          lbl.italic = true;
          lbl.content = tokens[index+5];

        }else {
          lbl.bold = false;
          lbl.italic = false;
          lbl.content = tokens[index+3];
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
          fontSize: lbl.fontSize,
          horizontalAlign: lbl.horizontalAlign,
          verticalAlign: lbl.verticalAlign
        });
      }

      // Construct SIGNATURE
      if (currentType === 'SIGNATURE' && el.indexOf('signature') !== -1 && el.indexOf('id=') !== -1) {

        // // Get Signature Properties
        const el2 = el.split(' ');
        let oriX: number = 0;     //  for border purpose

        el2.map(el => {
          let str = el.split('=');

          if (el.indexOf('x=') !== -1) { sig.x = ((+str[1]) / PP + 10); oriX = (+str[1])}
          if (el.indexOf('y=') !== -1) { sig.y = ((+str[1]) / PP + 10) + pgHgt; }
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

        // Get signature border size
        const sigBdToks = tokens[index-4].split(' ');
        const bdToks = sigBdToks[1].split('=');
        sig.borderSize = ( oriX - (+bdToks[1])) / PP;

        // Update X and Y due too border size
        sig.x = sig.x - sig.borderSize;
        sig.y = sig.y - sig.borderSize;

        // Push new signature component to array
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
          fontColor: sig.fontColor,
          borderSize: sig.borderSize
        });
      }

      // Construct Textfield
      if (currentType === 'TEXTFIELD' && el.indexOf('t') !== -1 && el.indexOf('x=') !== -1 && el.indexOf('y=') !== -1 && el.indexOf('font=') !== -1 
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

          if (el.indexOf('x=') !== -1) { txt.x = (((+str[1]) ) / PP + 10);}
          if (el.indexOf('y=') !== -1) { txt.y = ((+str[1]) ) / PP + 10 + pgHgt; }
          if (el.indexOf('w=') !== -1) { txt.width = ((+str[1]) - txt.borderSize*2*0.75)  / PP; }
          if (el.indexOf('h=') !== -1) { txt.height = ((+str[1] - txt.borderSize*2*0.75)) / PP; }
          if (el.indexOf('font=') !== -1) { txt.fontFamily = str[1]; }
          if (el.indexOf('sz=') !== -1) { txt.fontSize = +str[1] / PP; }
        });

        txt.componentType = 'Textfield';
        txt.componentId = `TEXTFIELD_${++txtId}`;
        txt.deleted = false;

        // For IC, PASSPORT, OTHER NAME, and PREVIOUS NAME
        if (tokens[index+6].indexOf('FIND_IC') !== -1 || 
            tokens[index+6].indexOf('FIND_PASSPORT') !== -1 ||
            tokens[index+6].indexOf('FIND_OTHER_NAME') !== -1 ||
            tokens[index+6].indexOf('FIND_PREVIOUS_NAME') !== -1 
        ) {
         
          // Get bold, italic, index of symbol position
          if (tokens[index+14] === 'bo' && tokens[index+16] === 'i') {
            txt.bold = true;
            txt.italic = true;
            txt.symPos = 18;

          }else if (tokens[index+14] === 'bo') {
            txt.bold = true;
            txt.italic = false;
            txt.symPos = 16;     

          }else if (tokens[index+14] === 'i'){
            txt.bold = false;
            txt.italic = true;
            txt.symPos = 16;

          }else {
            txt.bold = false;
            txt.italic = false;
            txt.symPos = 14;
          }

          // Set Symbol
          if (tokens[index+6].indexOf('FIND_IC') !== -1) {
            txt.symbolId = 'IC';
          }else if (tokens[index+6].indexOf('FIND_PASSPORT') !== -1) {
            txt.symbolId = 'PASSPORT';
          }else if (tokens[index+6].indexOf('FIND_OTHER_NAME') !== -1) {
            txt.symbolId = 'OTHER_NAME';
          }else if (tokens[index+6].indexOf('FIND_PREVIOUS_NAME') !== -1) {
            txt.symbolId = 'PREVIOUS_NAME';
          }

          // LINE 4 - Get conv
          const line4Tokens = tokens[index+txt.symPos].split(' ');
          line4Tokens.map (res => {
            const tok = res.split('=');

            if (res.indexOf('conv=') !== -1) { txt.conv = tok[1]; }
          });

        // For MAN_ADDRESS
        }else if (tokens[index+6].indexOf('FIND_MAN_ADDRESS') !== -1) {
          // 16->42, 18->44, 20->46
          // 16->48, 18->50, 20->52
          // 16->14, 18->16, 20->18
          // 14->20, 16->22, 18->26
          // Get bold, italic, index of symbol position
          if (tokens[index+20] === 'bo' && tokens[index+22] === 'i') {
            txt.bold = true;
            txt.italic = true;
            txt.symPos = 24;

          }else if (tokens[index+20] === 'bo') {
            txt.bold = true;
            txt.italic = false;
            txt.symPos = 22;     

          }else if (tokens[index+20] === 'i'){
            txt.bold = false;
            txt.italic = true;
            txt.symPos = 22;

          }else {
            txt.bold = false;
            txt.italic = false;
            txt.symPos = 20;
          }

          // Set symbols
          txt.symbolId = 'MAN_ADDRESS';

          // LINE 4 - Get conv
          const line4Tokens = tokens[index+txt.symPos].split(' ');
          line4Tokens.map (res => {
            const tok = res.split('=');

            if (res.indexOf('conv=') !== -1) { txt.conv = tok[1]; }
          });

        // For MAN_CITY, MAN_COUNTRY, MAN_POSTCODE, and MAN_STATE
        }else if( tokens[index+6].indexOf('FIND_MAN_CITY') !== -1 ||      
                  tokens[index+6].indexOf('FIND_MAN_STATE') !== -1 ||      
                  tokens[index+6].indexOf('FIND_MAN_COUNTRY') !== -1 ||      
                  tokens[index+6].indexOf('FIND_MAN_POSTCODE') !== -1    
        ) {

          // Get bold, italic, index of symbol position
          if (tokens[index+16] === 'bo' && tokens[index+18] === 'i') {
            txt.bold = true;
            txt.italic = true;
            txt.symPos = 20;

          }else if (tokens[index+16] === 'bo') {
            txt.bold = true;
            txt.italic = false;
            txt.symPos = 18;     

          }else if (tokens[index+16] === 'i'){
            txt.bold = false;
            txt.italic = true;
            txt.symPos = 18;

          }else {
            txt.bold = false;
            txt.italic = false;
            txt.symPos = 16;
          }

          // Set symbols
          if (tokens[index+6].indexOf('FIND_MAN_STATE') !== -1) {
            txt.symbolId = 'MAN_STATE';
          }else if (tokens[index+6].indexOf('FIND_MAN_CITY') !== -1) {
            txt.symbolId = 'MAN_CITY';
          }else if (tokens[index+6].indexOf('FIND_MAN_COUNTRY') !== -1) {
            txt.symbolId = 'MAN_COUNTRY';
          }else if (tokens[index+6].indexOf('FIND_MAN_POSTCODE') !== -1) {
            txt.symbolId = 'MAN_POSTCODE';
          }

          // LINE 4 - Get conv
          const line4Tokens = tokens[index+txt.symPos].split(' ');
          line4Tokens.map (res => {
            const tok = res.split('=');

            if (res.indexOf('conv=') !== -1) { txt.conv = tok[1]; }
          });

        // Normal symbols
        }else {

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
        }

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
      if (currentType==='CHECKBOX' && el.indexOf('t') !== -1 && el.indexOf('x=') !== -1 && el.indexOf('y=') !== -1 
          && tokens[index+2].indexOf('x=') !== -1 && tokens[index+2].indexOf('y=') !== -1 
          && tokens[index+6].indexOf('if') !== -1
          ) {
        
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

          if (el.indexOf('x=') !== -1) { chk.x = ((+str[1]) / PP + 10);}
          if (el.indexOf('y=') !== -1) { chk.y = ((+str[1])) / PP + 10 + pgHgt; }
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

          const pfToks = tokens[index+7].split('.');
          chk.pfId = pfToks[1];
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
  
    // console.log(this.fmlBodyProp);

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
    const PP: number = 0.75;                        // convert point to pixel... 1pt = 0.75px


    // Final FML script
    let finalFmlStr: string = ``;

    // Construct Start of body tag
    finalFmlStr += `<fml>\n\t<body width=${page.width*PP} height=${page.height*PP} bgcolor=${page.bgColor} font=${page.fontFamily} \n\t\tsize=${page.fontSize*PP} color=${page.fontColor}>\n`;

    for (let index = 0; index < this.fmlBodyProp.length; index++) {
      // Construct page tag and Screen Activation Number
      if (index !== 0) {
        finalFmlStr += `\n\t\t<!-- Page ${index+1} -->\n\t\t<page>\n`;

        const actNo: string = this.fmlBodyProp[index].screenActivationNumber;

        if (actNo !== 'NONE') {
          finalFmlStr += `\t\t<if>${actNo}<then></if>\n`;
        }

      }else if (index == 0) {
        finalFmlStr += `\n\t\t<!-- Page 1 -->\n`;

        const actNo: string = this.fmlBodyProp[index].screenActivationNumber;

        if (actNo !== 'NONE') {
          finalFmlStr += `\t\t<if>${actNo}<then></if>\n`;
        }
      }

      // Reference to Page Size, so that only create element that fall within the page size.
      const pgYMin: number = this.fmlBodyProp[index].y;
      const pgYMax: number = this.fmlBodyProp[index].y + this.fmlBodyProp[index].height;
      const bodyX: number = this.fmlBodyProp[index].x;
      const bodyY: number = this.fmlBodyProp[index].y;

      // Reference to page width, height, border size
      const pgW: number = this.fmlBodyProp[0].width;
      const pgH: number = this.fmlBodyProp[0].height;
      const pgBs: number = this.fmlBodyProp[0].borderSize;

      // Construct PAGE BORDER
      finalFmlStr += `\n`;
      finalFmlStr += `\t\t<!-- PG_BORDER -->\n`;
      finalFmlStr += `\t\t<t x=0 y=0 w=${pgW*PP} h=${pgBs*PP} bgcol=BLACK></t>\n`;                 // Top line
      finalFmlStr += `\t\t<t x=0 y=0 w=${pgBs*PP} h=${pgH*PP} bgcol=BLACK></t>\n`;                 // Left line
      finalFmlStr += `\t\t<t x=${(pgW-pgBs)*PP} y=0 w=${pgBs*PP} h=${pgH*PP} bgcol=BLACK></t>\n`;  // Right line
      finalFmlStr += `\t\t<t x=0 y=${(pgH-pgBs)*PP} w=${pgW*PP} h=${pgBs*PP} bgcol=BLACK></t>\n`;  // Bottom line
      finalFmlStr += `\n`;

      // Construct Signatures
      let addedSigComment: boolean = false;
      this.fmlSignatureProp.map(sig => {
        if (!sig.deleted && (sig.y >= pgYMin) && (sig.y+sig.height <= pgYMax) ) {

          if (!addedSigComment) {
            finalFmlStr += `\t\t<!-- Signatures -->\n`;
            addedSigComment = true;
          }

          // Signature border
          const sigBorder: string = `\t\t<t x=${(sig.x-bodyX)*PP} y=${(sig.y-bodyY)*PP} w=${(sig.width+(sig.borderSize*2))*PP} h=${(sig.height+(sig.borderSize*2))*PP} bgcol=BLACK></t>\n`;

          finalFmlStr += sigBorder;

          // Signature box
          const sigBox:string =
            `\t\t<signature x=${(sig.x-bodyX+sig.borderSize)*0.75} y=${(sig.y-bodyY+sig.borderSize)*0.75} width=${sig.width*0.75} height=${sig.height*0.75} 
              \t\twt=${sig.weight*PP} bgcolor=${sig.bgColor} color=${sig.fontColor} id=${sig.signatureId}>\n\n`;
  
          finalFmlStr += sigBox;

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

          // String for alignments
          const hrztAlign: string = lbl.horizontalAlign;
          const vAlign: string = lbl.verticalAlign;
          let alignStr: string = ``;

          if (hrztAlign === 'left') {
            alignStr += `x=0 align=left `;
          }else if (hrztAlign === 'center') {
            alignStr += `x=${(lbl.width/2)*PP} align=center `;
          }else if (hrztAlign === 'right') {
            alignStr += `x=${lbl.width*PP} align=right `;
          }

          if (vAlign === 'start') {
            alignStr += `y=0 valign=top`;
          }else if (vAlign === 'center') {
            alignStr += `y=${(lbl.height/2) * PP} valign=center`;
          }else if (vAlign === 'end') {
            alignStr += `y=${lbl.height*PP} valign=bottom`;
          }

          const str: string =
            `\t\t<t x=${(lbl.x-bodyX)*PP} y=${(lbl.y-bodyY)*PP} w=${lbl.width*PP} h=${lbl.height*PP} bgcol=${lbl.bgColor} col=${lbl.fontColor} font=${lbl.fontFamily} sz=${lbl.fontSize*PP}>
            \t\t<t w=${lbl.width*PP} h=${lbl.height*PP} ${alignStr}>
            \t\t\t${lbl.bold?'<bo>': ''}${lbl.italic?'<i>':''}${lbl.content}${lbl.italic?'</i>': ''}${lbl.bold?'</bo>':''}
            \t\t</t>
            \t</t>\n\n`;

            // Align left, center, right
            // x=0 align=right || x=width/2 align=center || y=width align=left
            // when reverse back, right is left in CSS, and left is right in CSS.

            // Valign top, center, bottom
            // y=0 valign=bottom || y=height/2 valign=center || y=height valign=top
            // when reverse back, bottom is top is CSS, and top is bottom in CSS.

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

          // SAMPLE if-else statement for PP, IC, OTHER_NAME, PREVIOUS_NAME
          // <if>ID_TYPE[0]<eq>"IC"<then> <ins sym=>
          // <else><if>ID_TYPE[1]<eq>"IC"<then> <ins sym=>
          // <else><if>ID_TYPE[2]<eq>"IC"<then> <ins sym=>
          // <else><if>ID_TYPE[3]<eq>"IC"<then> <ins sym=>
          // <else>
          // </if></if></if></if>

          if (txt.symbolId === 'MAN_ADDRESS') {
            finalFmlStr += `\t\t<var id=i>0</var>\n`;
            finalFmlStr += `\t\t<while>i<lt>AD_SIZE<and><not>AD_INTL_MAIL[i]<and><not>AD_DOM_MAIL[i]<and><not>AD_REGION_ID[i]<do>\n`;
            finalFmlStr += `\t\t\t<var id=i>i + 1</var>\n`;
            finalFmlStr += `\t\t</while>\n`;
          }

          finalFmlStr += `\t\t<t x=${(txt.x-bodyX)*PP} y=${(txt.y-bodyY)*PP} w=${(txt.width+BS*2)*PP} h=${(txt.height+BS*2)*PP} bgcol=BLACK font=${txt.fontFamily} sz=${txt.fontSize*PP}>\n`;
          finalFmlStr += `\t\t\t<t x=${BS*PP} y=${BS*PP} w=${txt.width*PP} h=${txt.height*PP} bgcol=${txt.bgColor} col=${txt.fontColor}>\n`;
          finalFmlStr += `\t\t\t\t<t w=${txt.width*PP} y=${(txt.height/2)*PP} valign=CENTER>\n`;
          // finalFmlStr += `\t\t\t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}`;

          // Loop to find symbols or just normal symbol
          if (txt.symbolId === 'IC') {
            // finalFmlStr += `\n`;
            finalFmlStr += `\t\t\t\t\t<!-- FIND_IC -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>ID_TYPE[0]<eq>"IC"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>ID_TYPE[1]<eq>"IC"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>ID_TYPE[2]<eq>"IC"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>ID_TYPE[3]<eq>"IC"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;
            // finalFmlStr += `\n`;

          } else if (txt.symbolId === 'PASSPORT') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_PASSPORT -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>ID_TYPE[0]<eq>"PP"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>ID_TYPE[1]<eq>"PP"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>ID_TYPE[2]<eq>"PP"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>ID_TYPE[3]<eq>"PP"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=ID_DOC_NO[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;

          } else if (txt.symbolId === 'OTHER_NAME') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_OTHER_NAME -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>OPCN_TYPE[0]<eq>"OTHER"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>OPCN_TYPE[1]<eq>"OTHER"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>OPCN_TYPE[2]<eq>"OTHER"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>OPCN_TYPE[3]<eq>"OTHER"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;

          } else if (txt.symbolId === 'PREVIOUS_NAME') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_PREVIOUS_NAME -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>OPCN_TYPE[0]<eq>"PREV"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>OPCN_TYPE[1]<eq>"PREV"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>OPCN_TYPE[2]<eq>"PREV"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>OPCN_TYPE[3]<eq>"PREV"<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=OPCN_NAME[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;
      
          }else if (txt.symbolId === 'MAN_ADDRESS') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_MAN_ADDRESS -->\n`;
            // finalFmlStr += `\t\t\t\t\t<var id=i>0</var>\n`;
            // finalFmlStr += `\t\t\t\t\t<while>i<lt>AD_SIZE<and><not>AD_INTL_MAIL[i]<and><not>AD_DOM_MAIL[i]<and><not>AD_REGION_ID[i]<do>\n`;
            // finalFmlStr += `\t\t\t\t\t\t<var id=i>i + 1</var>\n`;
            // finalFmlStr += `\t\t\t\t\t</while>\n`;
            
            finalFmlStr += `\t\t\t\t\t<if> i <lt> AD_SIZE <then>\n`;
            finalFmlStr += `\t\t\t\t\t\t<if> AD_1[i] <ne> "" <then>\n`;
            finalFmlStr += `\t\t\t\t\t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<insert symbol=AD_1[i] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t\t\t<break>\n`;
            finalFmlStr += `\t\t\t\t\t\t</if>\n`;
            finalFmlStr += `\t\t\t\t\t\t<if> AD_2[i] <ne> "" <then>\n`;
            finalFmlStr += `\t\t\t\t\t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<insert symbol=AD_2[i] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t\t\t<break>\n`;
            finalFmlStr += `\t\t\t\t\t\t</if>\n`;
            finalFmlStr += `\t\t\t\t\t\t<if> AD_3[i] <ne> "" <then>\n`;
            finalFmlStr += `\t\t\t\t\t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<insert symbol=AD_3[i] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t\t\t<break>\n`;
            finalFmlStr += `\t\t\t\t\t\t</if>\n`;
            finalFmlStr += `\t\t\t\t\t</if>\n`;

          }else if (txt.symbolId === 'MAN_CITY') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_MAN_CITY -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>AD_INTL_MAIL[0]<and>AD_REGION_ID[0]<and>AD_DOM_MAIL[0]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_CITY[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[1]<and>AD_REGION_ID[1]<and>AD_DOM_MAIL[1]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_CITY[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[2]<and>AD_REGION_ID[2]<and>AD_DOM_MAIL[2]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_CITY[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[3]<and>AD_REGION_ID[3]<and>AD_DOM_MAIL[3]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_CITY[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;

          }else if (txt.symbolId === 'MAN_STATE') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_MAN_STATE -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>AD_INTL_MAIL[0]<and>AD_REGION_ID[0]<and>AD_DOM_MAIL[0]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_STATE[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[1]<and>AD_REGION_ID[1]<and>AD_DOM_MAIL[1]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_STATE[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[2]<and>AD_REGION_ID[2]<and>AD_DOM_MAIL[2]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_STATE[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[3]<and>AD_REGION_ID[3]<and>AD_DOM_MAIL[3]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_STATE[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;

          }else if (txt.symbolId === 'MAN_POSTCODE') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_MAN_POSTCODE -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>AD_INTL_MAIL[0]<and>AD_REGION_ID[0]<and>AD_DOM_MAIL[0]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_POSTCODE[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[1]<and>AD_REGION_ID[1]<and>AD_DOM_MAIL[1]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_POSTCODE[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[2]<and>AD_REGION_ID[2]<and>AD_DOM_MAIL[2]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_POSTCODE[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[3]<and>AD_REGION_ID[3]<and>AD_DOM_MAIL[3]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_POSTCODE[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;

          }else if (txt.symbolId === 'MAN_COUNTRY') {
            finalFmlStr += `\t\t\t\t\t<!-- FIND_MAN_COUNTRY -->\n`;
            finalFmlStr += `\t\t\t\t\t<if>AD_INTL_MAIL[0]<and>AD_REGION_ID[0]<and>AD_DOM_MAIL[0]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_COUNTRY[0] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[1]<and>AD_REGION_ID[1]<and>AD_DOM_MAIL[1]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_COUNTRY[1] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[2]<and>AD_REGION_ID[2]<and>AD_DOM_MAIL[2]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_COUNTRY[2] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t<else><if>AD_INTL_MAIL[3]<and>AD_REGION_ID[3]<and>AD_DOM_MAIL[3]<then>${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=AD_COUNTRY[3] conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
            finalFmlStr += `\t\t\t\t\t</if></if></if></if>\n`;

          }else{
            finalFmlStr += `\t\t\t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=${txt.symbolId?`${txt.symbolId}`:`PF.${txt.pfId}`} conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
          }
          
          // finalFmlStr += `${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}\n`;
          finalFmlStr += `\t\t\t\t</t>\n`;
          finalFmlStr += `\t\t\t</t>\n`;
          finalFmlStr += `\t\t</t>\n\n`;

          // const str: string =
          //   `\t\t<t x=${(txt.x-bodyX)*PP} y=${(txt.y-bodyY)*PP} w=${(txt.width+BS*2)*PP} h=${(txt.height+BS*2)*PP} bgcol=BLACK font=${txt.fontFamily} sz=${txt.fontSize*PP}>
          //       \t<t x=${BS*PP} y=${BS*PP} w=${txt.width*PP} h=${txt.height*PP} bgcol=${txt.bgColor} col=${txt.fontColor}>
          //         \t\t<t w=${txt.width*PP} y=${(txt.height/2)*PP} valign=CENTER>
          //           \t\t\t${txt.bold?'<bo>': ''}${txt.italic?'<i>':''}<ins sym=${txt.symbolId?`${txt.symbolId}`:`PF.${txt.pfId}`} conv=${txt.textConv}>${txt.italic?'</i>': ''}${txt.bold?'</bo>':''}
          //         \t\t</t>
          //       \t</t>
          //   \t</t>\n\n`;

          //   finalFmlStr += str;
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
            `\t\t<t x=${(chk.x-bodyX)*PP} y=${(chk.y-bodyY)*PP} w=${(chk.width+BS*2)*PP} h=${(chk.height+BS*2)*PP} bgcol=BLACK sz=${chk.fontSize*PP}>
                \t<t x=${BS*PP} y=${BS*PP} w=${chk.width*PP} h=${chk.height*PP} bgcol=${chk.bgColor} col=${chk.fontColor}>
                  \t\t<t x=${(chk.width/2)*PP} y=${(chk.height/2)*PP} valign=CENTER align=CENTER>
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

  toggleGrid(showGrid: boolean) {
    this.showGrid = showGrid;

    this.isLoadFml$.next(true);
  }

  updateGlobalFontSize(fontSize: number) {

    // Update Labels
    for (let index = 0; index < this.fmlLabelProp.length; index++) {
      this.fmlLabelProp[index].fontSize = +fontSize;
    }

    // Update Textfields
    for (let index = 0; index < this.fmlTextfieldProp.length; index++) {
      this.fmlTextfieldProp[index].fontSize = +fontSize;
    }

    // Update Body
    for (let index = 0; index < this.fmlBodyProp.length; index++) {
      this.fmlBodyProp[index].fontSize = +fontSize;
    }

    // Update Checkbox
    for (let index = 0; index < this.fmlCheckboxProp.length; index++) {
      this.fmlCheckboxProp[index].fontSize = +fontSize;
    }

    // Notify subscriber to refresh all components
    this.isLoadFml$.next(true);
  }

  updateGlobalFontFamily(fontFamily: string) {
    // Update Labels
    for (let index = 0; index < this.fmlLabelProp.length; index++) {
      this.fmlLabelProp[index].fontFamily = fontFamily;
    }

    // Update Textfields
    for (let index = 0; index < this.fmlTextfieldProp.length; index++) {
      this.fmlTextfieldProp[index].fontFamily = fontFamily;
    }

    // Update Body
    for (let index = 0; index < this.fmlBodyProp.length; index++) {
      this.fmlBodyProp[index].fontFamily = fontFamily;
    }

    // Notify subscriber to refresh all components
    this.isLoadFml$.next(true);
  }
}
