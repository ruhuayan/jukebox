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
            <a routerLink="/imagegame">Image Game</a>
        </div>
       `
})
export class PanelRightComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
