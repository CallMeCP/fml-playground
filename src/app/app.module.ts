import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { TextfieldComponent } from './textfield/textfield.component';
import { ButtonComponent } from './button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BodyComponent } from './body/body.component';
import { FormsModule } from '@angular/forms';
import { SignatureComponent } from './signature/signature.component';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { GenFmlDialogComponent } from './gen-fml-dialog/gen-fml-dialog.component';
import { LabelComponent } from './label/label.component';

@NgModule({
  declarations: [
    AppComponent,
    TextfieldComponent,
    ButtonComponent,
    BodyComponent,
    SignatureComponent,
    GenFmlDialogComponent,
    LabelComponent
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
    MatDialogModule,
    MatCheckboxModule
  ],
  entryComponents: [
    GenFmlDialogComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
