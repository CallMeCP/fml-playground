import { Component, OnInit } from '@angular/core';
import { PropertyService } from './services/property.service';
import { FmlBody } from './interfaces/FmlBody.interface';
import { FmlSignature } from './interfaces/FmlSignature.interface';
import { MatDialog } from '@angular/material';
import { GenFmlDialogComponent } from './gen-fml-dialog/gen-fml-dialog.component';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { LoadFmlDialogComponent } from './load-fml-dialog/load-fml-dialog.component';
import { FmlButton } from './interfaces/FmlButton.interface';
import { FmlLabel } from './label/label.interface';
import { FmlTextField } from './textfield/textfield.interface';
import { FmlCheckbox } from './checkbox/checkbox.interface';

// MODULE INDEX
// NAME                       CONTENT
// constructor                Listen to UI component changes
// ngOnInit                   Generate first page, Listen whether to reload all components
// updateView                 Push Properties panel changes to UI component
// resetPropertyView          Hide show properties items
// showBodyProperties         Show properties available for Page/ Body
// showSignatureProperties    Show properties available for Signature
// showLabelProperties        Show properties available for Label
// showButtonProperties       Show properties available for Button
// showTextfieldProperties    Show properties available for Textfield
// showCheckboxProperties     Show properties available for Checkbox
// genButton                  Generate Button component
// genSignatureBlock          Generate Signature component
// genLabelBlock              Generate Label component
// genTextfield               Generate Textfield component
// genCheckbox                Generate checkbox component
// genPage                    Generate Page component
// genFml                     Generate FML scripts and show in dialog
// loadFml                    Load FML using dialog
// delete                     Just set component to invisible, it's still in array
// _filterSymbols             Helper to filter symbols
// _filterVariables           Helper to filter variables
// toggleGrids                Show or hide page grids
// toggleLockAll              Lock or unlock all components
// updateGlobalFontSize       Set all components with same font size
// updateGlobalFontFamily     Set all components with same font family
// addCondition               Add condition for checkbox (when it should tick)
// removeCondition            Remove condition for checkbox

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

  // lineWeights = [
  //   {value: 1, viewValue: '1'}, {value: 2, viewValue: '2'}, {value: 3, viewValue: '3'},
  //   {value: 4, viewValue: '4'}, {value: 5, viewValue: '5'}, {value: 6, viewValue: '6'},
  //   {value: 7, viewValue: '7'}, {value: 8, viewValue: '8'}, {value: 9, viewValue: '9'},
  // ];

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

  // borderSizes = [
  //   {value: 0, viewValue: '0'},
  //   {value: 1, viewValue: '1'}, {value: 2, viewValue: '2'}, {value: 3, viewValue: '3'},
  //   {value: 4, viewValue: '4'}, {value: 5, viewValue: '5'}, {value: 6, viewValue: '6'},
  // ];

  textTransforms = [
    {value: 'TOLOWER', viewValue: 'to lower'},
    {value: 'TOUPPER', viewValue: 'TO UPPER'},
    {value: 'TOTITLE', viewValue: 'To Title'},
  ];

  horizontalAligns = [
    {value: 'left', viewValue: 'Left'},
    {value: 'center', viewValue: 'Center'},
    {value: 'right', viewValue: 'Right'}
  ];

  verticalAligns = [
    {value: 'start', viewValue: 'Top'},
    {value: 'center', viewValue: 'Center'},
    {value: 'end', viewValue: 'Bottom'}
  ];

  symControl = new FormControl();
  sym2Control = new FormControl();
  filteredSymbolOptions: Observable<string[]>;
  symControlSub: Subscription;
  sym2ControlSub: Subscription;
  // another copy is copied to PropertyService. TODO: Re-vamp when free
  symbolIds: string[] = [
    'REAL_DATE', 'REAL_TIME', 'REAL_DATE_TIME', 'CUST_DATE', 'USER_ID', 'USER_NAME', 'CUST_ID',
    'CUST_NAME', 'CUST_TITLE', 'VINYL_TYPE', 'CUST_TYPE', 'NAS_NAME', 'NAS_TITLE', 'NAS_LANG',
    'OTHER_NAME', 'PREVIOUS_NAME',
    'OPCN_NAME[0]', 'OPCN_NAME[1]', 'OPCN_NAME[2]', 'OPCN_NAME[3]', 'OPCN_NAME[4]', 'OPCN_NAME[5]', 
    'OPCN_TITLE[0]', 'OPCN_TITLE[1]', 'OPCN_TITLE[2]', 'OPCN_TITLE[3]', 'OPCN_TITLE[4]', 'OPCN_TITLE[5]', 
    'OPCN_LANG[0]', 'OPCN_LANG[1]', 'OPCN_LANG[2]', 'OPCN_LANG[3]', 'OPCN_LANG[4]', 'OPCN_LANG[5]', 
    'OPCN_TYPE[0]', 'OPCN_TYPE[1]', 'OPCN_TYPE[2]', 'OPCN_TYPE[3]', 'OPCN_TYPE[4]', 'OPCN_TYPE[5]',
    'IC', 'PASSPORT', 
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
    {value:'', viewValue: ''},
    {value:'<eq>', viewValue: 'Equal to'},
    {value:'<ne>', viewValue: 'Not equal to'},
    {value:'<gt>', viewValue: 'Greater than'},
    {value:'<ge>', viewValue: 'Greater or equal than'},
    {value:'<lt>', viewValue: 'Less than'},
    {value:'<le>', viewValue: 'Less or equal than'},
    {value:'<not>', viewValue: 'Not'},
    {value:'<matches>', viewValue: 'Matches'},
  ];

  sans = [    // Screen activation number
    {value: 'NONE', viewValue: 'NONE'},
    {value: 'BASIC_DATA_SAN', viewValue: 'BASIC_DATA_SAN'},
    {value: 'ALT_EGOS_SAN', viewValue: 'ALT_EGOS_SAN'},
    {value: 'CONTACTS_SAN', viewValue: 'CONTACTS_SAN'},
    {value: 'APP_AND_PEP_SAN', viewValue: 'APP_AND_PEP_SAN'},
    {value: 'PREF_FLAGS_SAN', viewValue: 'PREF_FLAGS_SAN'},
    {value: 'DOCUMENTS_SAN', viewValue: 'DOCUMENTS_SAN'},
    {value: 'PHOTO_PIC_SAN', viewValue: 'PHOTO_PIC_SAN'},
    {value: 'SIGN_APP_SAN', viewValue: 'SIGN_APP_SAN'},
  ];

  chainConditions = [
    {value: '', viewValue: ''},
    {value: 'AND', viewValue: 'AND'},
    {value: 'OR', viewValue: 'OR'}
  ]

// ===================================================================================================
// Settings
  showGrid: boolean = true;
  lockAll: boolean = false;
  globalFontSize: number = 0;
  globalFontFamily: string = 'times new roman';

// ===================================================================================================
  // Button related
  btnId: number = 0;
  btnArr: number[] = [];
  btnArr2: FmlButton[] = [];
  btnProp: FmlButton;

  // Signature related
  sigId: number = 0;
  sigArr: number[] = [];
  sigArr2: FmlSignature[] = [];
  sigProp: FmlSignature;

  // Label related
  lblId: number = 0;
  lblArr: number[] = [];
  lblArr2: FmlLabel[] = [];
  lblProp: FmlLabel;

  // Textfield related
  txtId: number = 0;
  txtArr: number[] = [];
  txtArr2: FmlTextField[] = [];
  txtProp: FmlTextField;

  // Checkboxes related
  chkboxId: number = 0;
  chkboxArr: number[] = [];
  chkboxArr2: FmlCheckbox[] = [];
  chkboxProp: FmlCheckbox;

  // Page related
  pageId: number = 0;
  pageArr: number[] = [];
  pageArr2: FmlBody[] = [];
  pageProp: FmlBody;

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
  borderSize: number = 0;
  pfId: string = '';
  symbolId: string = '';
  varId: string = '';
  textConv: string = '';
  comparison: string = '';
  compareTo: string = '';
  horizontalAlign: string = '';
  verticalAlign: string = '';
  screenActivationNumber: string = '';
  movable: boolean = true;
  conditions: string[] = [];
  chainCondition: string = '';    // AND or OR
  textPadding: number = 0;


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
  showHorizontalAlign: boolean = false;
  showVerticalAlign: boolean = false;
  showScreenActivationNumber: boolean = false;
  showMovable: boolean = false;
  showTextPadding: boolean = false;

  disabledPageProp: boolean = false;

  isLoadFmlSub$: Subscription;

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
        this.borderSize = properties.borderSize || 0;
        this.pfId = properties.pfId || '';
        this.symbolId = properties.symbolId || '';
        this.varId = properties.varId || '';
        this.textConv = properties.textConv || 'TOLOWER';
        this.comparison = properties.comparison || '';
        this.compareTo = properties.compareTo || '';
        this.horizontalAlign = properties.horizontalAlign || 'center';
        this.verticalAlign = properties.verticalAlign || 'center';
        this.screenActivationNumber = properties.screenActivationNumber || 'NONE';
        this.movable = properties.movable;
        this.conditions = properties.conditions;
        this.textPadding = properties.textPadding;

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

        // Reset disabledPageProp status
        this.disabledPageProp = false;

        // Update Property Panel
        this.resetPropertyView();

        if (this.componentType === 'Page')
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

    // Load FML components
    this.isLoadFmlSub$ = this.propertyService.isLoadFml$.subscribe((isLoad) => {
      if (isLoad) {

        // Buttons
        this.btnArr2 = this.propertyService.fmlButtonProp.slice();
        this.btnId = this.btnArr2.length;
        
        // Labels
        this.lblArr2 = this.propertyService.fmlLabelProp.slice();
        this.lblId = this.lblArr2.length;

        // Signatures
        this.sigArr2 = this.propertyService.fmlSignatureProp.slice();
        this.sigId = this.sigArr2.length;

        // Textfields
        this.txtArr2 = this.propertyService.fmlTextfieldProp.slice();
        this.txtId = this.txtArr2.length;

        // Checkboxes
        this.chkboxArr2 = this.propertyService.fmlCheckboxProp.slice();
        this.chkboxId = this.chkboxArr2.length;

        // Pages
        this.pageArr2 = this.propertyService.fmlBodyProp.slice();
        this.pageId = this.pageArr2.length;
      }
    });

    // Generate a page on load
    this.genPage();
  }

  updateView() {
    this.propertyService.propertyToView$.emit({
      componentId: this.componentId,
      componentType: this.componentType,
      x: +this.x,
      y: +this.y,
      width: +this.width,
      height: +this.height,
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
      compareTo: this.compareTo,
      horizontalAlign: this.horizontalAlign,
      verticalAlign: this.verticalAlign,
      screenActivationNumber: this.screenActivationNumber,
      movable: this.movable,
      conditions: this.conditions,
      textPadding: this.textPadding
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
    this.showHorizontalAlign = false;
    this.showVerticalAlign = false;
    this.showScreenActivationNumber = false;
    this.showMovable = false;
    this.showTextPadding = false;
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
    this.showScreenActivationNumber = true;
    this.showBorderSize = true;

    if (this.componentType === 'Page' && this.componentId != 'PAGE_1') {
      this.disabledPageProp = true;
    }
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
    this.showBorderSize = true;
    this.showDelete = true;
    this.showMovable = true;
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
    this.showHorizontalAlign = true;
    this.showVerticalAlign = true;
    this.showMovable = true;
  }

  showButtonProperties() {
    this.showX = true;
    this.showY = true;
    this.showWidth = true;
    this.showHeight = true;
    this.showButtonId = true;
    this.showContent = true;
    this.showDelete = true;
    this.showMovable = true;
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
    // this.showContent = true;
    this.showBold = true;
    this.showItalic = true;
    this.showDelete = true;
    this.showBorderSize = true;
    this.showPfId = true;
    this.showSymbolId = true;
    this.showTextConv = true;
    this.showMovable = true;
    this.showTextPadding = true;

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
    // this.showPfId = true;
    // this.showVarId = true;
    // this.showSymbolId = true;
    this.showComparison = true;
    this.showCompareTo = true;
    this.showMovable = true;

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
    this.btnArr2.push({
      componentId: '',
      buttonId: '',
      componentType: '',
      content: '',
      deleted: false,
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      movable: true
    });
    this.btnId++;
  }

  genSignatureBlock() {
    this.sigArr2.push({
      componentId: '',
      componentType: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      weight: 0,
      bgColor: '',
      fontColor: '',
      signatureId: '',
      borderSize: 0,
      deleted: false,
      movable: true
    });
    this.sigId++;
    // this.sigArr.push(++this.sigId);
  }

  genLabelBlock() {
    this.lblArr2.push({
      componentId: '',
      componentType: '',
      content: '',
      deleted: false,
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      fontColor: '',
      fontFamily: '',
      fontSize: 0,
      bgColor: '',
      bold: false,
      italic: false,
      horizontalAlign: '',
      verticalAlign: '',
      movable: true
    });

    this.lblId++;
    // this.lblArr.push(++this.lblId);
  }

  genTextfield() {
    this.txtArr2.push({
      componentId: '',
      componentType: '',
      deleted: false,
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      content: '',
      fontColor: '',
      fontFamily: '',
      fontSize: 0,
      bgColor: '',
      borderSize: 0,
      symbolId: '',
      pfId: '',
      textConv: '',
      bold: false,
      italic: false,
      movable: true,
      textPadding: 0
    });

    this.txtId++;
    // this.txtArr.push(++this.txtId);
  }

  genCheckbox() {
    this.chkboxArr2.push({
      componentId: '',
      componentType: '',
      deleted: false,
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      fontColor: '',
      fontSize: 0,
      bgColor: '',
      borderSize: 0,
      // symbolId: '',
      // pfId: '',
      // varId: '',
      // compareTo: '',
      // comparison: '',
      movable: true,
      conditions: []
    });

    this.chkboxId++;
  }

  genPage() {
    this.pageArr2.push({
      componentId: '',
      componentType: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      bgColor: '',
      fontColor: '',
      fontSize: 0,
      fontFamily: '',
      screenActivationNumber: '',
      borderSize: 0
    });
    this.pageId++;
    // this.pageArr.push(++this.pageId);
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

  loadFml() {
    const dialogRef = this.dialog.open(LoadFmlDialogComponent, {
      width: '50vw',
      height: '90vh',
    });

    dialogRef.afterClosed().subscribe(res => {
      this.propertyService.loadFml(res);
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

  toggleGrids(event) {
    this.propertyService.toggleGrid(event.checked);
  }

  toggleLockAll(event) {
    this.propertyService.toggleLockAll(event.checked);
  }

  updateGlobalFontSize() {
    this.propertyService.updateGlobalFontSize(this.globalFontSize);
  }

  updateGlobalFontFamily() {
    this.propertyService.updateGlobalFontFamily(this.globalFontFamily);
  }

  setMovable(movable: boolean) {
    this.movable = movable;
    this.updateView();
  }

  addCondition() {
    // Add condition (assume a proper condition e.g. CUST_ID<eq>"1000010")
    if (this.symbolId !== '' || this.pfId !== '' || this.varId !== '') {
      let cond: string= ``;
      // cond += '<if>';
      cond += `${this.symbolId}${this.pfId!==''?'PF.':''}${this.pfId}${this.varId}${this.comparison}${this.varId!==''?'':'"'}${this.compareTo}${this.varId!==''?'':'"'}`;
      // cond += `</if>`;

      this.conditions.push(cond);
    }

    // Allow comparison only (e.g. to add only <NOT> as condition)
    if ((this.symbolId == '' && this.pfId == '' && this.varId == '') && this.comparison !== '') { 
      this.conditions.push(`${this.comparison}`);
    }

    // Add chaining condition
    if (this.chainCondition !== '') 
      this.conditions.push(this.chainCondition);

    // Update final FML
    this.updateView();
    
    // Reset fields
    this.sym2Control.reset('');
    this.symbolId = '';
    this.varControl.reset('');
    this.varId = '';
    this.pfId = '';
    this.compareTo = '';
    this.comparison = '';
    this.chainCondition = '';
  }

  removeCondition(index: number) {
    // Remove condition from array
    this.conditions.splice(index, 1);

    // Update final FML
    this.updateView();
    
  }

}
