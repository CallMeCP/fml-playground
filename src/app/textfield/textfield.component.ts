import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css']
})
export class TextfieldComponent implements OnInit {

  cusEle: any = [];

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
  }

  createElement() {
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText('hello');
  
    this.renderer.appendChild(div, text);
    this.renderer.appendChild(this.el.nativeElement, div);
    this.cusEle.push(div);
    console.log(this.cusEle);
    this.cusEle[0].style.fontSize = "20"; 
    // console.log("hello");
  }

}
