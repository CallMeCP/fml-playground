import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-load-fml-dialog',
  templateUrl: './load-fml-dialog.component.html',
  styleUrls: ['./load-fml-dialog.component.css']
})
export class LoadFmlDialogComponent {

  fmlScript: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoadFmlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}

    onCloseClick() {
      this.dialogRef.close('Cancel');
    }  

    onLoadClick() {
      this.dialogRef.close(this.fmlScript);
    }

}
