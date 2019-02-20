import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer">
    <div class="fContent">
        <div class="alink">|
            <a href="https://www.richyan.com"> Home </a>|
            <a href="https://www.richyan.com/javascript"> Javascript </a>|
            <a href="https://www.richyan.com/java"> Java </a>|
            <a href="https://www.richyan.com/android"> Android </a>|</div>
        <div class="copyright"> Copyright @ richyan.com</div>
    </div>
  </footer>`
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
