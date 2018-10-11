import { Component, OnInit } from '@angular/core';
import { PropertyService } from './services/property.service';
import { FmlBody } from './interfaces/FmlBody.interface';
import { FmlSignature } from './interfaces/FmlSignature.interface';
import { MatDialog } from '@angular/material';
import { GenFmlDialogComponent } from './gen-fml-dialog/gen-fml-dialog.component';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
// ===================================================================================
  // Options available
  colorCodes = [
    {value: 'black', viewValue: 'Black'},
    {value: 'blue', viewValue: 'Blue'},
    {value: 'brown', viewValue: 'Brown'},
    {value: 'green', viewValue: 'Green'},
    {value: 'grey', viewValue: 'Grey'},
    {value: 'orange', viewValue: 'Orange'},
    {value: 'red', viewValue: 'Red'},
    {value: 'transparent', viewValue: 'Transparent'},
    {value: 'violet', viewValue: 'Violet'},
    {value: 'white', viewValue: 'White'},
    {value: 'yellow', viewValue: 'Yellow'}
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

  borderSizes = [
    {value: 1, viewValue: '1'}, {value: 2, viewValue: '2'}, {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'}, {value: 5, viewValue: '5'}, {value: 6, viewValue: '6'},
  ];

  textTransforms = [
    {value: 'TOLOWER', viewValue: 'to lower'},
    {value: 'TOUPPER', viewValue: 'TO UPPER'},
    {value: 'TOTITLE', viewValue: 'To Title'},
  ];

  symControl = new FormControl();
  sym2Control = new FormControl();
  filteredSymbolOptions: Observable<string[]>;
  symControlSub: Subscription;
  sym2ControlSub: Subscription;
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

  varControl = new FormControl();
  filteredVarOptions: Observable<string[]>;
  varControlSub: Subscription;
  variables: string[] = [
    'ID_PRI_ID_FLAG[0]', 'ID_PRI_ID_FLAG[1]', 'ID_PRI_ID_FLAG[2]', 'ID_PRI_ID_FLAG[3]',
    'TEL_SMS[0]', 'TEL_SMS[1]', 'TEL_SMS[2]', 'TEL_SMS[3]', 'TEL_SMS[4]', 'TEL_SMS[5]', 
    'TEL_VOICE[0]', 'TEL_VOICE[1]', 'TEL_VOICE[2]', 'TEL_VOICE[3]', 'TEL_VOICE[4]', 'TEL_VOICE[5]', 
    'AD_REGION_ID[0]', 'AD_REGION_ID[1]', 'AD_REGION_ID[2]', 'AD_REGION_ID[3]', 
    'AD_INTL_MAIL[0]', 'AD_INTL_MAIL[1]', 'AD_INTL_MAIL[2]', 'AD_INTL_MAIL[3]', 
    'AD_DOM_MAIL[0]', 'AD_DOM_MAIL[1]', 'AD_DOM_MAIL[2]', 'AD_DOM_MAIL[3]', 
  ];

  comparisons = [
    {value:'<eq>', viewValue: 'Equal to'},
    {value:'<ne>', viewValue: 'Not equal to'},
    {value:'<gt>', viewValue: 'Greater than'},
    {value:'<ge>', viewValue: 'Greater or equal than'},
    {value:'<lt>', viewValue: 'Less than'},
    {value:'<le>', viewValue: 'Less or equal than'},
    // {value:'<not>', viewValue: 'Not'},
    {value:'<matches>', viewValue: 'Matches'},
  ];

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

  // Textfield related
  txtId: number = 0;
  txtArr: number[] = [];

  // Checkboxes related
  chkboxId: number = 0;
  chkboxArr: number[] = [];

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
  borderSize: number = 1;
  pfId: string = '';
  symbolId: string = '';
  varId: string = '';
  textConv: string = '';
  comparison: string = '';
  compareTo: string = '';

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
  showBorderSize: boolean = false;
  showSymbolId: boolean = false;
  showPfId: boolean = false;
  showVarId: boolean = false;
  showTextConv: boolean = false;
  showComparison: boolean = false;
  showCompareTo: boolean  = false;

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
        this.borderSize = properties.borderSize || 1;
        this.pfId = properties.pfId || '';
        this.symbolId = properties.symbolId || '';
        this.varId = properties.varId || '';
        this.textConv = properties.textConv || 'TOLOWER';
        this.comparison = properties.comparison || '';
        this.compareTo = properties.compareTo || '';

        // Reset Symbol controls
        if (this.symControlSub != null) {
          this.symControlSub.unsubscribe();
        }

        // Reset Symbol2 controls
        if (this.sym2ControlSub != null) {
          this.sym2ControlSub.unsubscribe();
        }

        // Reset Variable controls
        if (this.varControlSub != null) {
          this.varControlSub.unsubscribe();
        }

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
        else if (this.componentType === 'Textfield')
          this.showTextfieldProperties();
        else if (this.componentType === 'Checkbox')
          this.showCheckboxProperties();
      }
    );
  }

  ngOnInit() {
   
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
      deleted: this.deleted,
      borderSize: this.borderSize,
      pfId: this.pfId,
      symbolId: this.symbolId,
      varId: this.varId,
      textConv: this.textConv,
      comparison: this.comparison,
      compareTo: this.compareTo
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
    this.showBorderSize = false;
    this.showPfId = false;
    this.showSymbolId = false;
    this.showVarId = false;
    this.showTextConv = false;
    this.showComparison = false;
    this.showCompareTo = false;
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

  showTextfieldProperties() {
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
    this.showBorderSize = true;
    this.showPfId = true;
    this.showSymbolId = true;
    this.showTextConv = true;

    // Symbol control subscription
    this.symControlSub = this.symControl.valueChanges.subscribe(sym => {
      this.symbolId = sym;
      this.updateView();
    });
    
    // Symbol Filtering
    this.filteredSymbolOptions = this.symControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterSymbols(value))
      );
  }

  showCheckboxProperties() {
    this.showX = true;
    this.showY = true;
    this.showWidth = true;
    this.showHeight = true;
    this.showBgColor = true;
    this.showFontColor = true;
    this.showFontSize = true;
    this.showDelete = true;
    this.showBorderSize = true;
    this.showPfId = true;
    // this.showVarId = true;
    // this.showSymbolId = true;
    this.showComparison = true;
    this.showCompareTo = true;

    // Symbol control subscription
    this.sym2ControlSub = this.sym2Control.valueChanges.subscribe(sym => {
      this.symbolId = sym;
      this.updateView();
    });
    
    // Symbol Filtering
    this.filteredSymbolOptions = this.sym2Control.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterSymbols(value))
      );

      // Variable control subscription
    this.varControlSub = this.varControl.valueChanges.subscribe(varId => {
      this.varId = varId;
      this.updateView();
    });
    
    // Variable Filtering
    this.filteredVarOptions = this.varControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterVariables(value))
      );
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

  genTextfield() {
    this.txtArr.push(++this.txtId);
  }

  genCheckbox() {
    this.chkboxArr.push(++this.chkboxId);
  }

  genFml() {
    const fmlStr = this.propertyService.genFml();
    this.dialog.open(GenFmlDialogComponent, {
      width: '50vw',
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

  private _filterSymbols(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.symbolIds.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterVariables(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.variables.filter(option => option.toLowerCase().includes(filterValue));
  }

  over(e) {
    console.log(e.type);
  }
}
