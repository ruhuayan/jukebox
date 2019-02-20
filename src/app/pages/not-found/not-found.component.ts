import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  // templateUrl: './not-found.component.html'
  template: `
  <div class="conTitle" id="conTitle" ><h1 style="padding-left: 1rem;">404</h1>
  <div class="conSubTitle"> OOPS! Something went wrong here</div>
  <div class="conText row"></div>
  `
})
export class NotFoundComponent implements OnInit {

  constructor(private titleServer: Title) {
    this.titleServer.setTitle('Page Not Found - Poker Game');
  }

  ngOnInit() {
  }

}
