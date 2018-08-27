import { Component } from '@angular/core';
import { PropertyService } from './services/property.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'app';

  // Button related
  btnArr: number[] = [];

  // Signature related
  sigId: number = 0;
  sigArr: number[] = [];

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

  constructor(
    private propertyService: PropertyService
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

        // Update Property Panel
        this.resetPropertyView();

        if (this.componentType === 'Body')
          this.showBodyProperties();
        else if (this.componentType === 'Signature')
          this.showSignatureProperties();
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
      weight: this.weight
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
  }

  genButton() {
    this.btnArr.push(1);
  }

  genSignatureBlock() {
    this.sigArr.push(++this.sigId);
  }

  over(e) {
    console.log(e.type);
  }
}
