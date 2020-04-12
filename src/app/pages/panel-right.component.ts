import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-right',
  template: `
        <div class="categories">
            <a href="javascript:;">Angular Games</a>
        </div>
        <div class="category">
            <a routerLink="/jukebox" routerLinkActive="active">JukeBox</a>
        </div>
        <div class="category">
            <a routerLink="/igame" routerLinkActive="active">Image Game</a>
        </div>
        <!--<div class="category">
            <a routerLink="/faceapi" routerLinkActive="active">Face Detection</a>
        </div>-->
        <div class="category">
            <a routerLink="/blackjack" routerLinkActive="active">Blackjack</a>
        </div>
        <div class="category">
            <a routerLink="/solitaire" routerLinkActive="active">Solitaire</a>
        </div>
        <div class="category">
          <a routerLink="/points" routerLinkActive="active">24 Points</a>
        </div>
        <div class="category">
          <a routerLink="/balls" routerLinkActive="active">Balls</a>
        </div>
       `
})
export class PanelRightComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
