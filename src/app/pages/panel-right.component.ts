import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-right',
  template: `
        <div class="categories">
            <a href="javascript:;">Angular Games</a>
        </div>
        <div class="category">
            <a routerLink="/jukebox">JukeBox</a>
        </div>
        <div class="category">
            <a routerLink="/igame">Image Game</a>
        </div>
        <div class="category">
            <a routerLink="/blackjack">Blackjack</a>
        </div>
        <div class="category">
            <a routerLink="/solitaire">Solitaire</a>
        </div>
        <div class="category">
          <a routerLink="/points" >24 Points</a>
        </div>
        <div class="category">
          <a routerLink="/balls" >Balls</a>
        </div>
       `
})
export class PanelRightComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
