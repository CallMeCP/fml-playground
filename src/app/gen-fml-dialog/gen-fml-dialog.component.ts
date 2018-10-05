import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-gen-fml-dialog',
  templateUrl: './gen-fml-dialog.component.html',
  styleUrls: ['./gen-fml-dialog.component.css']
})
export class GenFmlDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GenFmlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  copyToClipboard() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.data.fmlScript;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
