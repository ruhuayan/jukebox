import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer">
    <div class="fContent">
        <div class="alink">|
            <a href="https://www.richyan.com"> Home </a>|
            <a href="https://javascript.richyan.com/"> Javascript </a>|
            <a href="https://dushu.richyan.com"> Dushu </a>|
            <a href="https://blog.richyan.com"> Blog </a>|</div>
        <div class="copyright"> Copyright @ richyan.com</div>
    </div>
  </footer>`
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
