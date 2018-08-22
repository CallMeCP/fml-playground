import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  // Default values
  x: number = 162 + 20;
  y: number = 64 + 20;
  width: number = 800;
  height: number = 600;

  px: number;
  py: number;
  draggingWindow: boolean = false;

  counter: number = 0;

  constructor() { }

  ngOnInit() {
  }

  resize() {
    // this.text = (++this.counter).toString();
    this.x = ++this.x;
    this.y = ++this.y;
    this.width = ++this.width;
    this.height = ++this.height;
  }

  onWindowPress(event: MouseEvent) {
    console.log("pressing");
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    console.log("drag");
    if (!this.draggingWindow) {
      return;
    }
    console.log("real drag");
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;

    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;

  }

  onWindowUp(event: MouseEvent) {
    this.draggingWindow = false;
  }

  onPassedby(event: MouseEvent) {
    console.log("over");
  }

}
