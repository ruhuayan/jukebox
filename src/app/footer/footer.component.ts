import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer">
    <div class="fContent">
        <div class="alink">|
            <a href="https://www.richyan.com"> Home </a>|
            <a href="https://javascript.richyan.com/"> Javascript </a>|
            <a href="https://java.richyan.com"> Java </a>|
            <a href="https://android.richyan.com"> Android </a>|</div>
        <div class="copyright"> Copyright @ richyan.com</div>
    </div>
  </footer>`
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
