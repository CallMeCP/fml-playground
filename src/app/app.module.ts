import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule } from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { TextfieldComponent } from './textfield/textfield.component';
import { ButtonComponent } from './button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BodyComponent } from './body/body.component';
import { FormsModule } from '@angular/forms';
import { SignatureComponent } from './signature/signature.component';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    TextfieldComponent,
    ButtonComponent,
    BodyComponent,
    SignatureComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,    
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
