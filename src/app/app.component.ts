import { Component } from '@angular/core';
import { PropertyService } from './services/property.service';
import { FmlBody } from './interfaces/FmlBody.interface';
import { FmlSignature } from './interfaces/FmlSignature.interface';
import { MatDialog } from '@angular/material';
import { GenFmlDialogComponent } from './gen-fml-dialog/gen-fml-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
// ===================================================================================
  // Options available
  colorCodes = [
    {value: 'black', viewValue: 'Black'},
    {value: 'brown', viewValue: 'Brown'},
    {value: 'red', viewValue: 'Red'},
    {value: 'orange', viewValue: 'Orange'},
    {value: 'yellow', viewValue: 'Yellow'},
    {value: 'green', viewValue: 'Green'},
    {value: 'blue', viewValue: 'Blue'},
    {value: 'violet', viewValue: 'Violet'},
    {value: 'grey', viewValue: 'Grey'},
    {value: 'white', viewValue: 'White'},
    {value: 'transparent', viewValue: 'Transparent'}
  ];

  fontFamilies = [
    {value: 'courier', viewValue: 'Courier'},
    {value: 'times new roman', viewValue: 'Times_Roman'},
    {value: 'helvetica', viewValue: 'Helvetica'},
  ];

  lineWeights = [
    {value: 1, viewValue: '1'}, {value: 2, viewValue: '2'}, {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'}, {value: 5, viewValue: '5'}, {value: 6, viewValue: '6'},
    {value: 7, viewValue: '7'}, {value: 8, viewValue: '8'}, {value: 9, viewValue: '9'},
    {value: 10, viewValue: '10'}, {value: 11, viewValue: '11'}, {value: 12, viewValue: '12'},
    {value: 13, viewValue: '13'}, {value: 14, viewValue: '14'}, {value: 15, viewValue: '15'},
    {value: 16, viewValue: '16'}, {value: 17, viewValue: '17'}, {value: 18, viewValue: '18'},
    {value: 19, viewValue: '19'}, {value: 20, viewValue: '20'}, {value: 21, viewValue: '21'},
  ];

  signatureIds = [
    {value: "NEW_APP_SIG_ID", viewValue: "NEW_APP_SIG_ID"}, 
    {value: "PRI_AUTH_SIG_ID", viewValue: "PRI_AUTH_SIG_ID"}, 
    {value: "SEN_NAME_SIG_ID", viewValue: "SEN_NAME_SIG_ID"},
    {value: "POX_SIG_ID", viewValue: "POX_SIG_ID"},
    {value: "PEP_SIG_ID", viewValue: "PEP_SIG_ID"},
  ];

  buttonIds = [
    {value: "BACK", viewValue: "BACK"},
    {value: "NEXT", viewValue: "NEXT"},
    {value: "NEW_APP_RESET_ID", viewValue: "NEW_APP_RESET_ID"},
    {value: "PRI_AUTH_RESET_ID", viewValue: "PRI_AUTH_RESET_ID"},
    {value: "SEN_NAME_RESET_ID", viewValue: "SEN_NAME_RESET_ID"},
    {value: "POX_RESET_ID", viewValue: "POX_RESET_ID"},
    {value: "PEP_RESET_ID", viewValue: "PEP_RESET_ID"}
  ]

// ===================================================================================================
  // Button related
  btnId: number = 0;
  btnArr: number[] = [];

  // Signature related
  sigId: number = 0;
  sigArr: number[] = [];

  // Label related
  lblId: number = 0;
  lblArr: number[] = [];

// ==================================================================================================
  // Possible properties, just list all component types
  // Update Constructor() and UpdateView() when update this
  componentId: string = '';
  componentType: string = '';
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  bgColor: string = "";
  fontColor: string = "";
  fontSize: number = 0;
  fontFamily: string = '';
  signatureId: string = '';
  weight: number = 0;
  content: string = '';
  bold: boolean = false;
  italic: boolean = false;
  buttonId: string = "";
  deleted: boolean = false;

  //  Show in property Panel? 
  showX: boolean = false;
  showY: boolean = false;
  showWidth: boolean = false;
  showHeight: boolean = false;
  showBgColor: boolean = false;
  showFontColor: boolean = false;
  showFontSize: boolean = false;
  showFontFamily: boolean = false;
  showSignatureId: boolean = false;
  showWeight: boolean = false;
  showContent: boolean = false;
  showBold: boolean = false;
  showItalic: boolean = false;
  showButtonId: boolean = false;
  showDelete: boolean = false;

  // Final properties
  // finalBodyProp: FmlBody;
  // finalSignatureProp: FmlSignature[];

  constructor(
    private propertyService: PropertyService,
    private dialog: MatDialog
  ) {
    this.propertyService.viewToProperty$.subscribe(
      properties => {

        // Set properties
        this.componentId = properties.componentId || "";
        this.componentType = properties.componentType || "";
        this.x = properties.x || 0;
        this.y = properties.y || 0;
        this.width = properties.width || 0;
        this.height = properties.height || 0;
        this.bgColor = properties.bgColor || "";
        this.fontColor = properties.fontColor || "";
        this.fontSize = properties.fontSize || 0;
        this.fontFamily = properties.fontFamily || "";
        this.signatureId = properties.signatureId || "";
        this.weight = properties.weight || 0;
        this.content = properties.content || "";
        this.bold = properties.bold || false;
        this.italic = properties.italic || false;
        this.buttonId = properties.buttonId || "";
        this.deleted = properties.deleted || false;

        // Update Property Panel
        this.resetPropertyView();

        if (this.componentType === 'Body')
          this.showBodyProperties();
        else if (this.componentType === 'Signature')
          this.showSignatureProperties();
        else if (this.componentType === 'Label')
          this.showLabelProperties();
        else if (this.componentType === 'Button')
          this.showButtonProperties();
      }
    );
  }

  updateView() {
    this.propertyService.propertyToView$.emit({
      componentId: this.componentId,
      componentType: this.componentType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      bgColor: this.bgColor,
      fontColor: this.fontColor,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      signatureId: this.signatureId,
      weight: this.weight,
      content: this.content,
      bold: this.bold,
      italic: this.italic,
      buttonId: this.buttonId,
      deleted: this.deleted
    });
  }

  resetPropertyView() {
    this.showX = false;
    this.showY = false;
    this.showWidth = false;
    this.showHeight = false;
    this.showBgColor = false;
    this.showFontColor = false;
    this.showFontSize = false;
    this.showFontFamily = false;
    this.showSignatureId = false;
    this.showWeight = false;
    this.showContent = false;
    this.showBold = false;
    this.showItalic = false;
    this.showButtonId = false;
    this.showDelete = false;
  }

  showBodyProperties() {
    this.showX = true;
    this.showY = true;
    this.showWidth = true;
    this.showHeight = true;
    this.showBgColor = true;
    this.showFontColor = true;
    this.showFontSize = true;
    this.showFontFamily = true;
  }

  showSignatureProperties() {
    this.showX = true;
    this.showY = true;
    this.showWidth = true;
    this.showHeight = true;
    this.showWeight = true;
    this.showBgColor = true;
    this.showFontColor = true;
    this.showSignatureId = true;
    this.showDelete = true;
  }

  showLabelProperties() {
    this.showX = true;
    this.showY = true;
    this.showWidth = true;
    this.showHeight = true;
    this.showBgColor = true;
    this.showFontColor = true;
    this.showFontSize = true;
    this.showFontFamily = true;
    this.showContent = true;
    this.showBold = true;
    this.showItalic = true;
    this.showDelete = true;
  }

  showButtonProperties() {
    this.showX = true;
    this.showY = true;
    this.showWidth = true;
    this.showHeight = true;
    this.showButtonId = true;
    this.showContent = true;
    this.showDelete = true;
  }

  genButton() {
    this.btnArr.push(++this.btnId);
  }

  genSignatureBlock() {
    this.sigArr.push(++this.sigId);
  }

  genLabelBlock() {
    this.lblArr.push(++this.lblId);
  }

  genFml() {
    const fmlStr = this.propertyService.genFml();
    this.dialog.open(GenFmlDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: {
        fmlScript: fmlStr
      }
    });
  }

  delete() {
    this.deleted = true;
    this.updateView();
  }

  over(e) {
    console.log(e.type);
  }
}
