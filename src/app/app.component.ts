import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  btnArr: number[] = [];


  genButton() {
    this.btnArr.push(1);
  }

  over(e) {
    console.log(e.type);
  }
}
